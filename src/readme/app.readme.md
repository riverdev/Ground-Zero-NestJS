# README file for Ground Zero NestJS

Git branch : [unit-base]
File name  : app.readme.md
Last update: 2022-09-09-1530
---------------------------------------------------------

# Overview

## Overview of Ground-Zero NestJS: 
- Ground-Zero NestJS is an Open Source project for "plug&play" source-code
  for building production grade back-ends.

## How does it work:
- GZ-Nest (Ground Zero NestJS) is made up of a base common source-code and multiple different 
  source codes that are all independent of one another and only dependent on the base source code.
  
- Each source code is called a "unit". So the base source code is named "unit-base" and one of the multiple others may be amed for example "unit-prisma-postgress" or "unit-auth-jwt".

- This organization of units that are independent of one another but have a shared base enables developers to merge multiple units into a production ready system.

# How to use GZ-Nest
- There are 3 different types of use cases to work with GroundZero NestJS:
  1. To build a new system.
  2. To add a new unit.
  3. To update / fix existing units.

## To build a new system based on GZ
- Description of workflow to build a new system:
  1. Clone the repo
  2. Checkout the latest release to a new branch, which will your new app's development branch.
  3. One by one checkout branch of units you want to have in your new app.
  4. Each unit you checkout integrate with into your develop branch & run tests.
  5. By the end of this process all units you picked will be integrated and working together.
  6. That's it you have all the infrastructure of a production ready system.
  7. Now start adding to your code the specific business logic, data structures etc of your app.

## To add a new unit and contribute to the OpenSource project
- In general the benfits of contributing to open source projects has mutual benfits to the project,
  to its community of users and to yourself for experience and resume.

- Description of workflow to add a new unit:
  1. Clone the repo
  2. Checkout the latest unit-base release to a new branch, which you give the name of the new unit.
  3. Develop the unit, following the development policy for adding a new unit:
     a. A unit must start development based on the newest release of "unit-base".
     b. A unit must not dependent on any other unit.
     e. A unit is required to have unit-test & e2e tests.
     c. The unit will include OpenAPi documentation (already setup in unit-base).
     d. The unit will have its own readme folder with these markdown files:
           - name.integratin.md
           - name.readme.ts
           - name.todo.md
  4. Once the unit is approved it will be published and available as part of the Open Source project. 

## To updgrade / fix an existing unit and contribute to the OpenSource project
- In general the benfits of contributing to open source projects has mutual benfits to the project,
  to its community of users and to yourself for experience and resume.

- Description of workflow to add a new unit:
    1. If you dont have the repo then first clone it.
    2. Checkout the branch of the unit you want to upgrade.
    3. Checkout the latest unit-base release to a new branch, which you give the name of the new unit.
    4. Merge the unit-base release into the branch you are upgrading.
    5. Edit the source code, readme files, OpenAPI doc as needed.
    6. Update and run unit-tests & e2e-tests.
    7. Push for approval.
    8. Once the upgraded unit is approved it will be published the Open Source project. 


## Secret files - how to manage .env files
- GZ-Nest is coded for production ready implementations, this includes solutions for managing multiple 
  environments such as development, production & testing.

- In the ./src/config/env folder you will find *.env files for each environment.

- All these files are tagged as to be ignored by Git (via the .gitignore file) except for the shared.env file.

- The shared.env file is used as a reference to the key-value syntax & format.

- To create your own dev, prod & test .env files copy the *shared.env* file and substitute your values for the 
  place-holder values. 


# Features included in unit-base

- The features included in this [unit-base] branch are:
    1. A CI/CD pipeline, see Dockerfile & .github/workflows yml files and also the release.config.js.
    2. A simple user file-system db module, see ./src/modules/user-filedb
    3. ConfigModule and environement var managment , see .src/config folder
    4. Swagger support for OpenAPI documentation   
    5. NestJs logger support 


## How to use Swagger OpenAPI feature
- todo: add content here


## How to use ConfigModule and env variables
- todo: add content here


## How to use Logger
- todo: add content here


# Routes supported by unit-base
1. / - the root route displays an HTML page with instructions and last-updated date.
2. *.. a list of all routes is described in file app.service.ts*
3. 

