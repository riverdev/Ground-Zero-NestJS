#  CHECKLIST file for Ground Zero NestJS [unit-auth-jwt] 

Git branch : [unit-auth-jwt]
File name  : auth.checklist.md
Last update: 2022-09-10-1115
-----------------------------------------------------------

## About this file:
This file is used to manage compliance with the Ground-Zero-NestJS Open Source project policy.

## How to use this file:
Update the status-tag of each line in the checklist to manage your compliance.

-----------------------------------------------------------
## Checklist for compliance
- Possible valuse for status are: Pend, Done, No-Need, TBD (decide later)

*Status |    Requierment*
*| Pend | Is documented with Open API Standard , using unit-base's Swagger |*
*| Pend | Has more than 60% unit-tests                                     |*
*| Pend | Has e2e tests for user workflows                                 |*
| Done | Is based on the latest release of 'main' branch                  |
| Done | Is using the env vars with ConfigModule                          |
| Done | Is using the Logger for logs                                     |
| Done | Is not using console logs                                        |
| Done | Is using the naming and syntax conventions described in the 'app.conventions.md' file  | 
| Done | Has a readme folder with updated files                           |

-----------------------------------------------------------
- Done : This line is here for example to show how a todo is labeled when done.

- Done : /src/modules/user-login-filedb : Refactor the names of the NestJS module, itis too long. Dont need the 
        "Login" suffix. Give a name like user-filedb for folder & UserFiledb for class name.

- Done : /src/modules/user-login-filedb : In create a new user add validation that the email doesnt already exist
         to some other user, if it does return an error that the email is already being used by another user.

-----------------------------------------------------------
## List of issues to fix
- No issues to fix in unit-base branch.

-----------------------------------------------------------
## Search the source code for todos
- Do a full source-code search for //todo comments in the files you added to this module.
- From what you find extract those tasks you want to take care of.
- When done with each task delete thier //todo comment.

-----------------------------------------------------------

