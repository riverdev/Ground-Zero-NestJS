# TODO file of [unit-load-gcloud] for Ground Zero NestJS

Git branch : unit-[load]-[gcloud]
File name  : storage.todo.md
Last update: 2022-09-29-1500
Status     : Completed (no more tasks/issues to add but still need to act on these tasks)

-----------------------------------------------------------

## About this file:
This file is used to manage tasks only related to this specific unit.


## How to use this file:
- Add todo items in same format as template example.
- When item is completed (tagged 'Done') move it to the history section at bottom of file
- Possible valuse for status are: *Pend, Fixed, Ignore, TBD (decide later)*


-----------------------------------------------------------
## Issues / Glitches 

- Pend  : Issue-1-error / storage.controller.ts / downloadFile()
        - This code expression triggers an error: "res.setHeader("Content-Type", storageFile.contentType);"
          Need to verify why this res.setHeader gives error: "Content type undefined in header"



--------------------
## Tasks completed

/......................................................................................
- Ignore: Issue-2022-09-30-0930-glitch / storage.constant.ts 
                           / Unsupported file type HttpException / Postman only ? 
       - This glitch causes the request that follows a previous request-that-responded-with-unsupported-file-error
        to freeze. It stays stuck on "Sending request" in postman.
        - The glitch doesnt happen in the case of the file-size error.
        - The glitch doesnt happen when using chrome browser (I only tested on the download endpoint and it worked in chrome but not in postman when it immediatly followed a prev request that returned unsupported-file-error).


-----------------------------------------------------------
## Tasks from //todo comments inside the code
 *To be thorough on covering all todos connected to this unit it is good practice to*
*do a search for "//todo" comments inisde code you added.*
*When done with each of those tasks remeber to delete their "//todo" comment.*
