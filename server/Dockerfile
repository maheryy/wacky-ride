FROM node:18-alpine 

ARG DB_URI

ENV JWT_SECRET=mySecret
ENV DB_URI=$DB_URI

WORKDIR /srv/app

COPY . .

RUN npm install --silent

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]