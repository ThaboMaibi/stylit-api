"use strict";
/**
*@swagger
*components:
*   schemas:
*       UserRegistration:
*           type: object
*           required:
*               -name
*               -surname
*               -email
*               -password
*               -countryCode
*           properties:
*               name:
*                   type: string
*                   description: valid name of the user
*               surname:
*                   type: string
*                   description: valid surname of the user
*               email:
*                   type: string
*                   description: valid email address of the user
*               password:
*                   type: string
*               countryCode:
*                   type: string
*       UserLogIn:
*           type: object
*           required:
*               -email
*               -password
*           properties:
*               email:
*                   type: string
*               password:
*                   type: string
*/
/**
*@swagger
* tags:
*   name: User
*   description: API to manage Users(note that only registration and login endpoints are not protected).
*/
//user end points
/**
* @swagger
* /user/register/:
*     post:
*       summary: Allows User create new accounts
*       tags: [User]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UserRegistration'
*       responses:
*         "200":
*           description: The new account was succefully created.
*/
/**
*@swagger
* /user/login/:
*     post:
*       summary: Allows User to log in to the system(returned token is used to authorize access to other endpoints)
*       tags: [User]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/UserLogIn'
*       responses:
*         "200":
*           description: Login successful.
*/
