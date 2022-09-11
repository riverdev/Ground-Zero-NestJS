<h1> Projects for skill practice excersise </h1>

<p>

### The concept
- These projects are focused on a specific skill competence.
- They are to be done repeatedly to keep the skill level up.

### Organization of projects
- All projects are focused on a specific feature / competency skill and are built on top of the base project named **Ground Zero**.

- The GroundZero has all the functionality and CI/CD process for a basic system with development and production servers on GCP (based on  Cloud Run).

- The feature a project is focused on will be the only feature in the project. So all projects are actually the same GroundZero project but with one additional feature.

- This is used to refresh and maintain skills of these focused competencies.

- For example a JWT skill project is a GroundZero (GZ) project with additonal code just for JWT skill. Similair an OAuth2 project will only have the OAuth2 code added to the GZ project.

- The GZ project has no database feature, so focus features that do need a db will have to use memory based objects to hold the data. 

</p>



<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


<p align="center">
            <h2> Project: GroundZero (alias GZ) </h2>
            <h3> Routes for this project: </h3>
            <ul>
            <li> / - This home page </li>
              <li> /notes - The notes homepage </li>
              <li> /notes/list - A list of notes </li>
              <li> /notes/<value> - POST a note with id <value> , you will get an error explaining what the body format is. </li>
              <li> /notes/<value> - PATCH a note with id <value> , you are free to put anything in the body. </li>
              <li> /notes/<value> - DELETE a note with id <value> , you will get a code 204 response. </li>
            </ul>
</p>

<p>

### Competencies covered in this skill project

- Create a new NestJS project with a sub-module (notes module).

- A commented out setup-app helper file which is an alternative to having the setup functionality in the root module (AppModule) for validation pipe.

- A root module (AppModule) with setup functionality for validation pipe.

- A Notes sub module.

- A DTO with validation rules to filter input for the POST route.

- Unit tests, total of 3, one for the app module & two for the notes module.

- A *Dockerfile* to build an image for the whole app.

- A prettier package to check formatting before commiting code.


### Organization of projects
- All projects are focused on a specific feature / competency skill and are built on top of the base project named **Ground Zero**.

- The GroundZero has all the functionality and CI/CD process for a basic system with development and production servers on GCP (based on  Cloud Run).

- The feature a project is focused on will be the only feature in the project. So all projects are actually the same GroundZero project but with one additional feature.

- This is used to refresh and maintain skills of these focused competencies.

- For example a JWT skill project is a GroundZero (GZ) project with additonal code just for JWT skill. Similair an OAuth2 project will only have the OAuth2 code added to the GZ project.

- The GZ project has no database feature, so focus features that do need a db will have to use memory based objects to hold the data. 

</p>
