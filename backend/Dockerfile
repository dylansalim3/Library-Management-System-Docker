FROM node:13.12.0-alpine
RUN apk add --no-cache \
    python\
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    ttf-opensans

WORKDIR /backend
COPY package.json /backend
RUN npm install -g nodemon
RUN npm i -g node-gyp@latest && npm config set node_gyp "/usr/local/lib/node_modules/node-gyp/bin/node-gyp.js"
RUN npm install
RUN npm install canvas && npm install bcrypt
RUN npm run postinstall
EXPOSE 5000
COPY . /backend
CMD ["npm","start"]
