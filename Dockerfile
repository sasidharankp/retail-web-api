FROM node:12.19-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ENV DEV_DB_HOST = ""
ENV DEV_DB_USERNAME = ""
ENV DEV_DB_PASSWORD = ""

#Default Credentials
ENV DOCKER_USERNAME=""
ENV DOCKER_REPOSITORY=""
ENV DOCKER_IMAGE_TAG=""

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT 5000
EXPOSE $PORT
CMD [ "npm", "start" ]
