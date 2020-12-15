const ItemsService = {
    getAllItems(knex) {
        return knex.select('*').from('cc_items')
    },

    getById(knex, id) {
        return knex 
            .from('cc_items')
            .select('*')
            .where('id', id)
            .first()
    }, 

    insertItem(knex, newItem) {
        return knex
            .insert(newItem)
            .into('cc_items')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteItem(knex, id) {
        return knex('cc_items')
          .where({ id })
          .delete()
      },

      updateItem(knex, id, newItemFields) {
        return knex('cc_items')
          .where({ id })
          .update(newItemFields)
      },
}

module.exports = ItemsService