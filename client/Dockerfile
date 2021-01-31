
FROM node:12.20-alpine as build
WORKDIR /client
COPY package.json /client
RUN npm install
COPY . /client
RUN npm run build


FROM nginx:stable-alpine
COPY --from=build /client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
