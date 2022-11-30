# Multiplayer card game in a web browser

This project was created as a bachelor's degree thesis in Computer Science (Computer Information System Engineering) at Warsaw University of Technology.

Deployed application available at [CardGame](https://cardgame.adam-steciuk.com/).

## Structure of the repository

Frontend is located in the [client](client) directory.

Backend is located in the [server](server) directory.

## How to run

Install [Node.js](https://nodejs.org/en/).

Check respective READMEs:

-   [Frontend](client/README.md)
-   [Backend](server/README.md)

## Thesis abstract

The paper presents the vision, design, and implementation of a website that allows users to play multiplayer card games directly in a web browser. The application features registering and logging in to the website while maintaining modern security standards. User sessions are maintained using JSON Web Token. Users can create new game rooms (public and password-protected) and join existing ones with ease. The website is legible, visually appealing, and designed with a modern approach to reacting to interactions with the user in mind. The frontend part of the project, thanks to the single-page application of the Angular framework, maintains the latest standards of efficiency and responsiveness. Consistency of the game state was ensured using WebSocket technology, whereas data persistence was preserved using the non-relational MongoDB database. The backend server was created utilizing the Express framework and runs in the Node.js runtime environment.

The application's source code uses mainly HTML, CSS, and the TypeScript programming language.

Also discussed in the paper are the technologies used in the implementation of the application, as well as design patterns, which allow the project to be easily scalable and developed in the future.

The finished solution has been publicly deployed to the Internet using services such as Firebase and Heroku.

Keywords: Angular, website, TypeScript, HTML, CSS, SPA, JWT, multiplayer card game, Express, Node.js, WebSocket, MongoDB, Firebase, Heroku.
