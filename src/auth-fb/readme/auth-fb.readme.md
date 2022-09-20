# README file of [lab-dtbs-frbs] branch in Ground Zero NestJS

Git branch : lab-[dtbs]-[frbs]
File name  : auth-fb.readme.md
Last update: 2022-09-20-1645
Source for this code: YouTube:  https://www.youtube.com/watch?v=KSZse2cuMUw&t=1s
Link to documentation:  app.diagrams.net (drawio):  https://app.diagrams.net/#G15zye5DvmDc2vauIlkDN2dw_ICL9sDWag

# Overview

## Overview of Ground-Zero NestJS: 
- Ground-Zero NestJS (aka GZ-Nest) is an Open Source project for "plug&play" source-code
  for building production grade back-ends.

## Overview of branches labeled as "lab"
- Git branches in GZ-Nest labeled "lab-xx-xx" are associated with branches that are created for sandbox / lab use - they are not planed for production use nor for integration with othe branches.

## Overview of Firestore DB in NestJS
- There are three ways to implement firestore database in NestJS:
    1. Using GCP-firestore directly, bypassing Firebase altogether. 
        This will have different pricing so need to verify the pricing.
        The npm package in this case is :  *npm install @google-cloud/firestore*
    
    2. Using Firebase-Admin-SDK. Dedicated to back ends
       This is a Firestore library which menas pricing and opening a project is via the Firebase console. 
       This overides all authentication rules set in the console because it is dedicated to backend.
       The npm package to install this is:  *npm install firebase-admin*

    3. Using FirebaseJS, this is the same library used by formtends.
       Using this library adds the overhead of dealing with authentication & Read/Write rules.
       The npm packages to install this are:  *npm install firebase @types/firebase*

## Overview of Firebase in NestJS [lab-dtbs-frbs]
- In this source-code branch named [lab-dtbs-frbs] we implement the third option.
- That is why you will see the use of *firebase/auth* component in the register & login route.
- Also the Firebase project owner needs to manually set the "rules" logic for the datbase in the Project->Settings in the console. For this version implemented here I set the rules to all all Read & Write.


# Routes supported in this [lab-dtbs-frbs] branch 
1. */register - Uses firebase/auth to authenticate & add a new user to Firebase's Auth-User internal DB*
2. */login/ - Uses firebase/auth to login but then also uses firebase/firestore to get the data of the app's User db*


## Issues
1. The e2e tests wont work without some preperation, they give out an error:
    **FirebaseError: Firebase: Error (auth/invalid-api-key).**

2. In order to run them you need to comment out the wireup to firebase as explained here:
    Go to the AppModule and comment out :
       imports  : AuthFbModule
       providers: FirebaseService

