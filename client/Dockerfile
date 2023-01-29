# build environment
FROM node:18-alpine as build

WORKDIR /app

ARG VITE_API_URL

COPY . .

RUN npm install --silent

RUN npm run build


# production environment
FROM nginx:1.23-alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]