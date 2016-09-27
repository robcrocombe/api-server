FROM node:latest

MAINTAINER Daniel Brown <danny@csblogs.com>
LABEL name="csblogs-api-server"

RUN mkdir /usr/src/csblogs-api-server
WORKDIR /usr/src/csblogs-api-server

COPY package.json /usr/src/csblogs-api-server
RUN npm install

COPY . /usr/src/csblogs-api-server

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ];
CMD ["start"]
