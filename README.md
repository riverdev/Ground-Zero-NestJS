# Ground Zero NestJS Open Source Project

<p align="center">
  <img src="./media/gif-gz-nestjs-logo.gif" width="200" alt="Nest Logo" /> </a>
</p>


<p>

### About Ground Zero NestJS :
- "Ground Zero NestJS", aka GZ-Nest, is an Open Source project that enables developers to quickly start a new NestJS project and then, as the project grows, easily plug&play new feature-units into it.

### How it works in general :
- In general the GZ-Nest architecture is analogous to a PC motherboard, it enables different plug-&-play components to easily connect/disconnect from it to build different PCs with different features.

- Refering to this analogy, the backend project you want to create is the PC and GZ-Nest is the PC-building-kit which includes a mother-board with different plu&play components to choose from (sound, graphics, , ....).

### How it works in practice :
- In practice GZ-Nest consists of "code-units", where one of the code units is the "motherboard" (in the analogy), this unit is named "unit-base".

- The features of the unit-base are the minimum features needed for a production ready backend, this includes a Logger, OpenAPI docs (swagger), CI/CD pipeline to GitHub Actions and whatever is needed as the basic infrastructure.

- All other units are developed to integrate with unit-base, they are independent of one another and only dependent on the unit-base.

- Each unit is a feature, for example an authentication feature with jwt access & refresh tokens is *unit-auth-jwt*, or a feature with prisma mysql is *unit-dtbs-prsm-msql*. 

</p>


<p> 

### Was made for developers who want :

- To have ready made source code for components of their own project to speed up development time.

- To contribute to an OpenSource project fairly easy because their model is 100% theirs from start to finish so less involvment in someelses code (just pick a pending skill unit from a list) - will help their resume and experience.

- To learn a new skill such as using typeorm with Postgress or JWT authentication with refresh tokens.
Each unit is a skill that can be learned.

</p>
