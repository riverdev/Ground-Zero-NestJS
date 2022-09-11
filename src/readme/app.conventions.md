# CONVENTIONS for Ground Zero NestJS

Git branch : unit-base
File name  : app.conventions.md
Last update: 2022-09-08-1500

# Overview
This file describes conventions used so that the code is consistent between 
the different units being developed and maintained by different people at different times.

## Branch naming conventions
- The convention for a unit branch is : unit-[category]-[component-name]

- [category] types & codes are:
  - Authentication      : auth
  - Database            : dtbs
  - Third Party Service : srvc (i.e. 'stripe' , 'twilio' ...)


- [component-name] convention:
  - Use 1 to 4 letters to symbolize the componenet name.
  - If the name contains more than one subject (i.e. typeorm-mysql has 2 subjects),
    then each will be coded with up to 4 letters (i.e. tprm-msql).

## Syntax naming convention :
- App constants
  - These are defined in the file /src/common/constants.
  - Use UPPERCASE_LETTERS seperated by underscore

- Folder names
  - Use lower case letters seperated by hyphen (dash '-')
