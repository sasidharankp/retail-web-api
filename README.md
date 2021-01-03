# Retail Web API


[![Code Coverage](https://codecov.io/gh/sasidharankp/retail-web-api/branch/main/graph/badge.svg)](https://codecov.io/gh/sasidharankp/retail-web-api)
[![Continuous Integration](https://github.com/sasidharankp/retail-web-api/workflows/Continuous%20Integration/badge.svg?branch=main)](https://github.com/sasidharankp/retail-web-api/actions?query=workflow%3A%22Continuous+Integration%22)

A set of REST endpoints to manage an online store.
Perform Crud Operations on Products
Place and Cancel Orders

# TechStack
-   JavaScript
-   Node 13.X
-   Express
-   Mongo


## Manage .env Files

The .env files are encrypted using `gpg` and the `AES256` cipher algorithm.
create 2 files as `.env.test` and `.env.dev` from `.env.sample` by replacing the values with db credentials

Encrypt `.env.dev` and `.env.test` files using the command using a passphrase
```bash
gpg --cipher-algo AES256 --symmetric .env.dev
gpg --cipher-algo AES256 --symmetric .env.test
```
This will create encrypted files `.env.dev.gpg` and `.env.test.gpg` which need to be checked in to repository

similarly these Encrypted files can be decrypted using the following commands
```bash
gpg --output .env.dev --decrypt .env.dev.gpg
gpg --output .env.test --decrypt .env.test.gpg
```
set the passphrase used to encrypt the files as secrets in github
SECRET_PASSPHRASE=passphrase

> NEVER check in unencrypted secrets into repositories



## Available Routes

### Products
Sample Data To Create A new Product
```json
{
"name":  "Maths Book",
"category":"books",
"description":  "Engineering Mathematics 1",
"price":  10.99,
"image":  "https://i.picsum.photos/id/1010/5184/3456.jpg"
}
```
GET:

-   /products (get all products)
-   /products/:id (get specific product based on id)
-   /products?limit=3 (limit return results )
-   /products?sort=desc (asc|desc get products in ascending or descending orders)
-   /products/products/categories (get all categories)
-   /products/category/electronics (get all products in specific category)


POST:
-   /products

-PUT
-   /products/1

-DELETE
-   /products/1

### Carts
Sample Data To Create A new Cart
```json
{
  "userId": 1,
  "products": [
    {
      "productId": 16,
      "quantity": 1
    }
  ]
}
}
```

GET:

-   /carts (get all carts)
 -   /carts?limit=5 (limit return results )
-   /carts/1 (get specific cart based on id)

POST:
>Can be used to both create and update cart
-   /carts

DELETE:
-   /carts/1

### Users
Sample Data To Create A new Cart
```json
{
  "email": "sheldon@gmail.com",
  "username": "sheldon",
  "password": "bazinga",
  "name": {
    "firstname": "Sheldon",
    "lastname": "Cooper"
  },
  "address": {
    "city": "Texas",
    "street": "south street",
    "number": 3,
    "zipcode": "91001",
    "geolocation": {
      "lat": "-46.3159",
      "long": "71.1496"
    }
  }
}
```

GET:

-   /users (get all users)
-   /users/1 (get specific user based on id)

POST:
-   /users

PUT:
-   /users/1

DELETE:
-   /users/1
