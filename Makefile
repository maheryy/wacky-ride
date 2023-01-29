
#### Production commands ####

# Build the app for production
build:
	@docker compose -f docker-compose.demo.yml build --no-cache

# Run the app in production mode
start:
	@docker compose -f docker-compose.demo.yml up -d
	@echo "Wacky ride live at http://localhost:8080/"


# Stop and remove all docker services
stop: 
	@docker compose -f docker-compose.demo.yml down


# Show logs for all services
logs:
	@docker compose -f docker-compose.demo.yml logs --tail=5



#### Other commands ####

# Init .env files and install client/server dependencies
dev: 
	@cp ./client/.env.template ./client/.env
	@cp ./server/.env.template ./server/.env
	@cd ./server && npm ci
	@cd ./client && npm ci

start-db:
	@docker compose up -d

stop-db:
	@docker compose down

# Database seeding
seed:
	@docker compose exec server npm run seed
