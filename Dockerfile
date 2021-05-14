FROM node:15.8.0-alpine AS build-env

RUN mkdir /client
WORKDIR /client

COPY ./client/ ./

# Build client
RUN npm install
RUN npm run build

FROM node:15.8.0-alpine AS runtime

RUN mkdir /server
WORKDIR /server

COPY ./server/ ./
RUN npm install

COPY --from=build-env /client/build/ ./build/

RUN chown -R node:node ./

# Creates a user for our container
USER node

# Tells our container who owns the copied content
COPY --chown=node:node . .

EXPOSE 4000

CMD ["npm", "run", "start"]