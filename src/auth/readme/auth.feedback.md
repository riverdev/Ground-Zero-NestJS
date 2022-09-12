# This file is for feedback to maintainer of [unit-base]

Git branch : [unit-auth-jwt]
File name  : auth.feedback.md
Last update: 2022-09-12-1400
---------------------------------------------------------

## About this file:
This file concentrates issues & ideas as feedback to the maintainer of [unit-base].

## How to update this file:
Add issues and ideas in the dedicated sections of this file.

## Who uses this file:
This is written by a featur unit developer to the [unit-base] maintainer.
The maintainer will go through the content, and respond to each one with an objective to
  answer/propagate in order to tag them as closed.


---------------------------------------------------------
## Actions needed to be done on the side of the module-base branch

### Important actions:
1. /src/modules/user-filedb : In create a new user add validation that the email doesnt already exist to some other user, if it does return an error that the email is already being used by another user.

2. /src/modules/user-filedb : Refactor the names of the NestJS module, itis too long. Dont need the "Login" suffix. Give a name like user-filedb for folder & UserFiledb for class name.
