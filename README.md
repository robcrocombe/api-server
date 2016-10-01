# CS Blogs API Server
[![Build Status](https://travis-ci.org/csblogs/api-server.svg?branch=master)](https://travis-ci.org/csblogs/api-server)
[![Coverage Status](https://coveralls.io/repos/github/csblogs/api-server/badge.svg?branch=master)](https://coveralls.io/github/csblogs/api-server?branch=master)
[![Code Climate](https://codeclimate.com/github/csblogs/api-server/badges/gpa.svg)](https://codeclimate.com/github/csblogs/api-server)
[![Dependency Status](https://david-dm.org/csblogs/api-server.svg)](https://david-dm.org/csblogs/api-server)
[![Slack Status](http://csblogs-slack-signup.azurewebsites.net/badge.svg)](http://csblogs-slack-signup.azurewebsites.net)

The service which allows access to CS Blogs data. Most data is public and can be accessed by anyone, but the service also has an authentication capability to allow for user management.

All applications, including the [CS Blogs website](http://csblogs.com) go through this API.

## Building and Running Locally
If you're interested in how exactly building the docker image and running a container works read the deep dive, otherwise skip straight to the _Docker compose_ section.


### Deep Dive
The application is deployed as an immutable [Docker](https://www.docker.com) container. You can build and run this docker container on your machine once you've installed the docker deamon and CLI tools.

To build the API-Server `cd` to this repository and enter the following command: 

```
docker build -t csblogs-api-server .
```

This builds the docker image and allows you to refer to it later with the tag `csblogs-api-server`. To then run an container instance of the API-Server you can issue the following command:

```
docker run -p 80:80 csblogs-api-server
```

The `-p` flag maps port 80 on your machine to port 80 inside the container. The API-Server binds to port 80 inside the container. If you'd rather have it on another port on your host machine change the value on the left. `3000:80` would allow you to access the API-Server on port 3000 from your machine.

You'll likely notice at this point that the application logs an error:

```
Connection to Database Failed { host: undefined,
      port: undefined,
      name: undefined,
      username: undefined }
```

This is because the connection information for the database is provided through environment variables which we haven't set. You can set each of these environment variables using the `-e` flag to the `docker run` command. The environment variable names are listed in the `docker-compose.yml` file. Clearly, in order to be able to do this you will need your own PostgreSQL database. This is where `docker-compose` comes in -- it allows us to stand up both a PostgreSQL container and an API-Server container using just one command and allows us to set environment variables in a file, rather than having to have many `-e` flags in our `docker run` command.

### Docker compose
Before you can use `docker-compose` you need to add values for each of the environment variables in the `docker-compose.yml` file. The `POSTGRES_USER` and `POSTGRES_PASSWORD` should match up with `CSBLOGS_DATABASE_USERNAME` and `CSBLOGS_DATABASE_PASSWORD` respectively. `CSBLOGS_DATABASE_PORT` needs to match postgres, which is usually `5432` and the hostname of the Postgres container will be the service name provided -- in this case that's `csblogs-postgres`.

Once you have added the environment variable properties you can simple run `docker-compose up` to get both an API Server and the supporting database.

## Testing
The API-Server comes with a bunch of tests written in a BDD fashion using `chai` and `mocha`. You can run these in your docker container by issuing the command `docker run csblogs-api-server test`.

## Linting
All code for the CSBlogs project uses the Airbnb `ESLint` style rules. To run the linter against your code in order to check if it meets the projects style guidlines you can issue the command `docker run csblogs-api-server lint`.

## Deploying
The API-Server is hosted on [Zeit Now](https://zeit.co/now). One of the cool things about using `Now` is that anyone can deploy, up to 20 times a month, for free. So to have your own instance of the API-Server running in the cloud (at no cost) you just have to issue a few commands.

`npm run deploy` will deploy the dockerized version of the API-Server, so it should operate exactly the same as the docker container on your local machine.

Zeit's free offering requires that all of your source code is public, meaning that storing passwords in plaintext in code is a big no-no. Therefore, to provide the container running in the cloud with the host, password, etc of the database you have to use `Now` secrets -- these are then exposed to the container as environment variables. For each of the environment variables specified in the `package.json/scripts/deploy` script (identifiable by the `@` prefix) issue the command `now secret add @variable_name value`. Once they've all been set, run `npm run deploy` and your cloud instance of the API-Server will be able to access your database.
