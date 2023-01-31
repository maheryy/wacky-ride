# Wacky Ride

## Requirements

[Docker](https://docs.docker.com/get-docker/)  
[Node](https://nodejs.org/en/download/)

## Try it out

Run the app for the first time using the following command

```
make build start seed  
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


For later usage, run :
```
make start
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

## Contributing

Get the app ready using the following command

```
make dev
```

Start a postgres container with the provided docker-compose file

```
make start-db
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


## Contributors

[@3kezoh](https://github.com/3kezoh)  
[@Arthur-creator](https://github.com/Arthur-creator)  
[@maheryy](https://github.com/maheryy)  