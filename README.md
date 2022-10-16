# Wacky Ride

## Requirement

- Docker (with docker-compose)
- Node

## Get started

_Run the entire app through docker_

```
docker compose -f docker-compose.demo.yml up -d
```

_Create database schemas (recreate if already exist)_

```
npm run migrate
```

_Populate the database with pre-defined data_

```
npm run seed
```