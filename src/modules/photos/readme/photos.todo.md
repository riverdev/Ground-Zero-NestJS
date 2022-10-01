# TODO file of [unit-load-local] for Ground Zero NestJS

Git Branch : unit-[load]-[local]
File name  : photos.todo.md
Last update: 2022-10-01-1340
Status     : Completed (no more tasks/issues to add but still need to act on these tasks)


-----------------------------------------------------------

## About this file:
This file is used to manage tasks only related to this specific unit (my-unit)

## How to use this file:
- Add todo items in same format as template example.
- When item is completed (tagged 'Done') move it to the history section at bottom of file
- Possible valuse for status are: *Pend, Fixed, Ignore, TBD (decide later)*


-----------------------------------------------------------
## Issues / Glitches 

- Pend : /src/modules/photos/photos.controller.ts  --> The 'uploadFile' route
        I want to send a custom NotFoundException in case cannot find the file but I dont know how. 
        Currently the res.sendFile() command creates its own error type, which is intercepted by the 'HttpErrorFilter' in our code, but the filter doesnt recognize the http-error-code so it wraps the unknown code with a default '505' code and a comment that it did this conversion.
        This means we get an error message but cannot understand that it is a 'file-not-found' case.
        I dont know how to change this state.
        I left a try-catch in the code to wrap the res.sendFile but it is not triggered.
        Need to learn more on the res.sendFile to see how to catch it's error.

- Pend : /src/modules/photos/common/photos.constants.ts  --> env-var values for constants
        I want the values of the constants set in this file to be refrenced by env-vars, but I 
        dont know how to integrate ConfigModule into a file of constants (I know how to do it in classes).


--------------------
## Tasks completed
none