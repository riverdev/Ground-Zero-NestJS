# README file of [unit-load-gcloud] for Ground Zero NestJS (GZNest)

Git branch : unit-[catagory]-[myunit]
File name  : my-unit.readme.md
Last update: 2022-09-08-1500
Status     : Completed


# Overview

## Overview of Ground-Zero NestJS: 
- GZNest is an Open Source project for "plug&play" source-code
  for building production grade back-ends.

## Overview of [unit-load-gcloud]
- The objective of this unit is to be an API that enables interaction with a Google
  Cloud Storage (GCS) bucket.
- It is based on the [unit-base] but completly independent of all other units in GZNest.

# How to use GZNest:
- List of use cases for this unit:
  1. To upload files to GCS bucket.
  2. To download files from the GCS bucket.
  3. To delete a file from the GCS bucket.

# Customization potential:  *Ideas on how to customize the unit for other features*
- List of potential customizations, these are just some of the options, imagination is the limit:
  1. Change the types of allowed files to your needs.
  2. Add a service to return the download url.
  3. Upload/Download multiple files (for loop)
  4. Add verification if file type matches the file extension (that a text file doesnt have a *.png extension).
  5. ...


# Features included in [unit-load-gcloud]
- The features included in this branch:
    1. *Upload image* 
    2. *Download image* 
    3. *Delete image*


# Routes supported by [unit-load-gcloud]
1. POST http://localhost:8080/storage/upload + 'file' payload Postman->Body->FormData
        - This endpoint uploads the file given in the Body-FormData to the GCS bucket
2. GET http://localhost:8080/storage/1664463269157-73234-dog.jpg
        - This endpoint uploads from the GCS bucket the file given in url
3. DELETE http://localhost:8080/storage/1664462213816-15536-dog.jpg
        - This endpoint deletes from the GCS bucket the file given in url

