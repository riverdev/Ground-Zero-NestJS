#  CHECKLIST file for Ground Zero NestJSof [unit-dtbs-mong]

Git branch : unit-[dtbs]-[mong]
File name  : books.checklist.md
Last update: 2022-10-01-1530
Status     : Completed


-----------------------------------------------------------

## About this file:
This file is used to manage compliance with the Ground-Zero-NestJS Open Source project policy.

## How to use this file:
Update the status-tag of each line in the checklist to manage your compliance.


-----------------------------------------------------------
## Checklist for compliance
- Possible valuse for status are: Pend, Done, No-Need, TBD (decide later)
- To mark as done, update the status and delete the itailcs symbol '*' on bothe sides of each line.
*Status |    Requierment*
*| Pend | Is documented with Open API Standard , using unit-base's Swagger |*
*| Pend | Has more than 60% unit-tests                                     |*
*| Pend | Has e2e tests for user workflows                                 |*
| Done | Is based on the latest release of 'main' branch                  |
| Done | Is using the env vars with ConfigModule                          |
| Done | Is using the Logger for logs                                     |
*| Pend | Is not using console logs                                        |*
| Pend | Is using the naming and syntax conventions described in the 'app.conventions.md' file  |
| Pend | Has a readme folder with updated files                           |