#  JWT module README file

Git branch : [unit-auth-jwt]
File name  : auth.readme.md
Last update: 2022-09-12-1426
---------------------------------------------------------

# Overview

## Overview of [unit-auth-jwt]
- This unit focuses on JWT Authentication with a refresh token.


# How to use Ground-Zero NestJS
- List of use cases for this unit: *example here are for an authentication unit*
  1. To JWT authenticate signup login refresh token & signout.

# Features included in unit-base
- The features included in this branch are:
    1. *Create AT & RT tokens with expiration duration* 
    2. *Once the AT expires can use the RT to create a new AT* 
    3. *Once th RT expires cannot refresh AT or RT, need to login again*
    4. *A logout service will delete the RT, then can still have access until the AT expires*
    5. *There is a route to test the AT, named profile*

# Routes supported by unit-base
1. /auth/jwt/signup  : - input email & password => Returns AT & RT
2. /auth/jwt/login   : - input email & password => Returns AT & RT
3. /auth/jwt/logout  : - input AT => Deletes the Refresh token from db BUT : AT is still alive after logout
4. /auth/jwt/refresh : - input *RT* => Returns only the AT
5. /auth/jwt/profile : - input AT => Just to validate that the AT works returns some info 

## How to configure
- To manage the token durations and payload-content: 
  -  Update the file : *`src/auth/constants`*.

