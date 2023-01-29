# Wacky Ride

## Requirements

- Docker (with docker-compose)
- Node

## Try it out

_Shorthand command to run the app for the first time_

```
make build start seed
```

_Just run make start_
```
make start
```

## Commands

_Run the entire app through docker_

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

Populate the database with random data

```
make seed
```

Then you can start working on client or server separately

```
cd client && npm run dev
```

```
cd server && npm run dev
```
