# Wacky Ride

Wacky Ride is a platform where riders meet and chat with each others. You can ask for help or share your experience. Our chatbot and advisors are also available to answer your questions or schedule an appointment directly in our stores.  

## Technology stack

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/-SOCKET.IO-lightgrey?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)  
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## Try it out

### Live demo

Wacky Ride is hosted on Github Pages at https://maheryy.github.io/wacky-ride/

### Local demo

Run the app for the first time using the following command

```
$ make build start seed

### Without make ###
$ docker compose -f docker-compose.demo.yml up -d --build
$ docker compose exec server npm run seed:prod
```

Wacky Ride will then be available at http://localhost:8080

Log in with the following credentials

```
# As an admin
email: admin@wacky.com
password: password

OR

# As a regular user
email: user@wacky.com
password: password
```

Enjoy chatting and riding with Wacky Ride community !

## Contributing

Get the app ready using the following command

```
$ make dev
```

Start a postgres container with the provided docker-compose file

```
$ make start-db
```

Then you can start working on client or server separately

```
$ cd client
$ npm run dev
```

```
$ cd server
$ npm run dev
$ npm run seed
```

## Commands

```
$ make build // Build the app in production mode
$ make start // Run the app in production mode
$ make stop // Stop the running app
$ make seed // Populate the database with random data
$ make dev // Get the app ready for development
$ make start-db // Start a postgres container
$ make stop-db // Stop the postgres container
```

## Contributors

[@3kezoh](https://github.com/3kezoh)  
[@Arthur-creator](https://github.com/Arthur-creator)  
[@maheryy](https://github.com/maheryy)

## License

[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/3kezoh/blackjack/blob/master/LICENSE)

This project is licensed under the terms of the [MIT License](https://choosealicense.com/licenses/mit/).
