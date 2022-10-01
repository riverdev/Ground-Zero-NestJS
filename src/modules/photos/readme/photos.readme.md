# README file of [unit-load-local] for Ground Zero NestJS

Git Branch : unit-[load]-[local]
File name  : photos.readme.md
Last update: 2022-10-01-1340
Status     : Completed

---------------------------------------------------------

# Overview

## Overview of Ground-Zero NestJS: 
- Ground-Zero NestJS is an Open Source project for "plug&play" source-code
  for building production grade back-ends.

## Overview of [your unit name here]
- This unit adds endpoints that enable to manage a file uploaded from outside the server.
- The functionality is implemented here on a "photos" module, it enables to receive an image 
  via the url request, do some validation on the file and then upload the file to the server's local storage.

---------------------------------------------------------

# How to use Ground-Zero NestJS
- List of use cases for this unit: *example here are for an authentication unit*
  1. Send a file inside the request and the file is uploaded to the server.
  2. Download a file from the server local-storage.
  3. Delete a file from the server local-storage.


# FYI - Things to be aware of
- Since the files are saved locally on the server there are limitations:
  1. The server filesystem will run out of storage space quickly because it is not meant for storage.
  2. In case of running the feature from a CloudRun service (or any non-persistent host) then the files will be deleted automatically when the server times-out.


---------------------------------------------------------

# Customization potential:  *Ideas on how to customize the unit for other features*
- List of potential customizations, these are just some of the options, imagination is the limit:
*The list here is an example taken from the unit-load-gcloud*
  1. Change the types of allowed files to your needs.
  2. Upload/Download multiple files (for loop)
  3. ...


---------------------------------------------------------

# Features included in [your unit name here]
- The features included in this branch come from other branches,
    1. Upload a file  : POST   :  http://localhost:8080/photos/upload  + Body file = buffer of image-file
                        If using POstman you need to use the dessktop version not the web-browser.

    2. Download a file: GET    :  http://localhost:8080/photos/1664-my-photo.png

    3. Delete a file  : DELETE :  http://localhost:8080/photos/1664-my-photo.png  //Same url as GET
---------------------------------------------------------

# Routes supported by unit-base
1. */myunit/feat1 - short explanation...*
2. */myunit/feat2 - short explanation...*
3. ...

