# Closet Catalogue API

Back end code to https://closet-catalogue.vercel.app/

## Endpoints 

### Authorization 
POST /api/auth/singin : Authorizes User Sign In with JWT Authentication 

POST /api/auth/refresh : Refreshes the page after period of time to keep user logged in

### Items (Protectd Endpoints)
GET /api/items : Gets all the items

POST /api/items : Adds new item to the database

DELETE /api/items/:itemId : Deletes an item 

PATCH /api/items/:itemId : Edits an Item

### Users (Protected Endpoints)
POST api/users : Creates a New User

GET api/users/:userId : Gets a User's information 

DELETE api/users/:userId : Deletes a User

PATCH api/ users/:userId : 









