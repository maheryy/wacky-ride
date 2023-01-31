FROM node:18-alpine 

WORKDIR /srv/app

COPY . .

RUN npm install --silent

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]