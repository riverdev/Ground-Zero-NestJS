# TODO file of [your unit name here] for Ground Zero NestJS

Git branch : unit-[catagory]-[myunit]
File name  : my-unit.todo.md
Last update: 2022-09-08-1500
Status     : *Options to tag this field:
     *Option-1 : Pending* 
     *Option-2 : Completed (no more tasks/issues to add but still need to act on these tasks)*


-----------------------------------------------------------

## About this file:
This file is used to manage tasks only related to this specific unit (my-unit)

## How to use this file:
- Add todo items in same format as template example.
- When item is completed (tagged 'Done') move it to the history section at bottom of file
- Possible valuse for status are: *Pend, Fixed, Ignore, TBD (decide later)*

*Below are examples*

-----------------------------------------------------------
## Issues / Glitches 

- Pend : Search the //todo comments to extract tasks then delete the comments. 


--------------------
## Tasks completed
- Done : /src/modules/user-login-filedb : Refactor the names of the NestJS module, itis too long. Dont need the 
        "Login" suffix. Give a name like user-filedb for folder & UserFiledb for class name.

- Done : /src/modules/user-login-filedb : In create a new user add validation that the email doesnt already exist
         to some other user, if it does return an error that the email is already being used by another user.

-----------------------------------------------------------
## Tasks from //todo comments inside the code
 *To be thorough on covering all todos connected to this unit it is good practice to*
*do a search for "//todo" comments inisde code you added.*
*When done with each of those tasks remeber to delete their "//todo" comment.*
