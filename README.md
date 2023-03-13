# Getting Started

# Back-end Project: Game-Board Backend

## Overview:

This is backend apis project.
This project was built with Node JS, Express JS and Mongo DB. Normal CRUD app.

## Download or clone repo

### `npm install`

### Requirements

- DB from Mongo.
- Create ".env" file and Add Mongo DB connection uri string to the "DATABASE_URI" inside ".env".
- Collections are "users" & "games".
- Modify allowedOrigins based on requirements.

#### "users" collection

- Fields are firstName, lastName, userName and email.
- "userName" should be unique.

#### "games" collection

- Fields are gameName, gameCategory, releaseYear and publisher.
- "gameName" should be unique.

### `npm run dev`

Development mode: [http://localhost:9000/](http://localhost:9000/).

## Thank for visiting :)
