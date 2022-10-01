# README file of [unit-dtbs-mong] for Ground Zero NestJS (GZNest)

Git branch : unit-[dtbs]-[mong]
File name  : books.readme.md
Last update: 2022-10-01-1530
Status     : Completed
Draw.io link:  https://app.diagrams.net/#G1I1Kao0VdPOwAXsZUMxWIuvlBprMMq6oi

# Overview

## Overview of Ground-Zero NestJS: 
- GZNest is an Open Source project for "plug&play" source-code
  for building production grade back-ends.

## Overview of [unit-dtbs-mong]
- The objective of this unit is to enable a CRUD capability with a MongoDB Atlas server.
- To demonstrate the unit uses a 'books' module to manage a book library.
- It is based on the [unit-base] but completly independent of all other units in GZNest.

# How to use this GZNest unit:
- A detailed workflow exists in the drawio file:  https://app.diagrams.net/#G1I1Kao0VdPOwAXsZUMxWIuvlBprMMq6oi
  The general steps to activate this module are:
  1) Create a MOngoDB Atlas project and DB
  2) Copy the `shared.env` file to a new file named `dev.env`
  3) Copy the values from the MongoDB Atlas project & DB to the dev.env
  4) Then run the app and use the endpoints to test.


# Customization potential:  *Ideas on how to customize the unit for other features*
- List of potential customizations, these are just some of the options, imagination is the limit:
  1. Add more properties to the book and then use MongoDB agregation commands.
  2. Add a filter route to extract book entries.
  3. Add another db (like Libraries) and have the books & libraries db interact.
  4. ...


# Features included in [unit-load-gcloud]
- The features included in this branch:
  1. Create a new db entry.
  2. Get all the book entries in the db.
  3. Get a specific book entry.
  4. Update a specific book entry.
  5. Delete a specific book entry.


# Routes supported by [unit-load-gcloud]
1. To create a new book:                  POST http://localhost:8080/books + body: 
```
{
    "title": "Title-1",
    "desc": "New book",
    "price": 23
}
```

2. To get all the books in db:             GET    :  http://localhost:8080/books 

3. To get a specific book from the db:     GET    :  http://localhost:8080/books/632d6b86d9b58

4. To delete a specific book from the db:  DELETE :  http://localhost:8080/books/632d6b86d9b58

5. To create a new book:                   PATCH  :  http://localhost:8080/books/632d6b86d9b58 + body: 

```
{
    "title": "Updated-Title",
    "desc": "my-updated-book",
    "price": 35
}
```