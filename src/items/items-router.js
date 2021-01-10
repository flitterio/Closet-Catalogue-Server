const path = require('path')
const express = require('express')
const xss = require('xss')
const ItemsService = require('./items-service')
const { requireAuth } = require('../middleware/jwt-auth')

const itemsRouter = express.Router()
const jsonParser = express.json()

const serializeItem = item => ({
    id: item.id,
    userid: item.userid,
    title: xss(item.title),
    image: xss(item.image),
    season: item.season,
    category: item.category,
    favorite: item.favorite,
})

itemsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next ) => {
        const knexInstance = req.app.get('db')
        ItemsService.getUserItems(knexInstance, req.user.id)  
        .then(items => {
            res.json(items.map(serializeItem))
        })
        .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next ) => {
        const { title, image, season, category, favorite} = req.body
        let newItem = { title }

        for (const [key, value] of Object.entries
        (newItem))
        if (value == null)
            return res.status(400).json({
                error: {message: `Missing '${key}' in request body` }
            })
        
       newItem = { ...newItem, image, season, category, favorite}

        newItem.userid = req.user.id
        
        //console.log(newItem.userid)

        return ItemsService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item =>{
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${item.id}`))
                .json(serializeItem(item))
            })
            .catch(next)
    })


    itemsRouter
        .route('/:itemId')
        .all(requireAuth)
        .all((req, res, next) => {
            ItemsService.getById(
              req.app.get('db'),
              req.params.itemId
            )
              .then(item => {
                if (!item) {
                  return res.status(404).json({
                    error: { message: `Item doesn't exist` }
                  })
                }
                res.item = item
                next()
              })
              .catch(next)
          })
          .get((req, res, next) => {
            res.json(serializeItem(res.item))
          })
          .delete((req, res, next) => {
            ItemsService.deleteItem(
              req.app.get('db'),
              req.params.itemId
            )
              .then(numRowsAffected => {
                res.status(204).end()
              })
              .catch(next)
          })
          .patch(jsonParser, (req, res, next) => {
            const { title, userid, image, season, category, favorite } = req.body
            const itemToUpdate = { title, userid, image, season, category, favorite }
        
            const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
              return res.status(400).json({
                error: {
                  message: `Request body must contain either title, image, season, category, or favorite`
                }
              })
        
            ItemsService.updateItem(
              req.app.get('db'),
              req.params.itemId,
              itemToUpdate
            )
              .then(numRowsAffected => {
                res.status(204).end()
              })
              .catch(next)
          })
        
        module.exports = itemsRouter