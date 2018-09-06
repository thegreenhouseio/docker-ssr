![](https://www.docker.com/sites/default/files/horizontal.png)
# docker-ssr
A Docker container that mounts a local webpack build and server-side renders it.

The goal being to allowing for a simple `docker-compose` of your frontend and being able share your SSR runtime between all your apps.  Cool, right?  😎

## Overview
Server-side rendered applications often couple client and server code into one codebase.  I prefer to keep my frontend builds distinct from the backend implementation.  Static files are just static files and should be easily deployed to a webserver or S3, via FTP or SSH, whatever.

> This is more like building a better mouse trap, really
> ![](https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX2831761.jpg)

### In practice...
So rather than mix **client** and **server** code and dependencies in one repository, I've created a Docker container that provides a SSR runtime environment that will an app to mounted to the container, based on a couple of configuration times
- build output directory
- Javascript entry point
- HTML entry point

## Usage
Work In Progress

#### Observations
- Compare the results of running `yarn build` vs `yarn serve` and compare the HTML source of both.  We can see we are getting stateful SSR in both environments, using **webpack-dev-server** and **Express** server, respectively.  
- This begins to highlight that we can have a clean seperation of our development environment from our SSR environment (e.g. Dockerize the SSR part) while having near universal code.  
- Further work will be done to define a clean way of bridging the coupling in the TODOs section below.  
- So far seeing positive results so far into realizing the vision!

#### TODOs
By focusing on these key developer experience points, we can try and cleanly abstract the development runtime from the production runtime without any hassle and also open this up to any library / framework that can meet this fairly lightweight requirements (IMO)
1. hydrate vs render in client entry point (index.js)
1. need to define API for syncing state schema between client and server
1. need to define API for syncing mounting point across client and server (`id="app"`) in index.html / entry point and server
1. Rename source to fixture(s)?
1. Consumer provides build script / all source code via mount point?  main.js?

## Development
This repository provides a [**React**](https://reactjs.org/) project built with [**webpack**](https://webpack.js.org/) for development / testing purposes.  The intent is to act as a fixture for what's defined in _Dockerfile_.

### Setup
1. [ ] Install [**Docker**](https://www.docker.com/products/docker-desktop)
1. [ ] Install [**NodeJS**](https://nodejs.org/en/) v8.x
1. [ ] Optionally, install [**Yarn**](https://yarnpkg.com/en/docs/install)


### Workflow
Development is a two part process:

#### 1) UI Application
Develop with the React project and validate using available **npm** scripts (**Yarn** or **npm** supported):

- `yarn lint` - lint the project source code
- `yarn develop` - test changes with [**webpack-dev-server**](https://webpack.js.org/configuration/dev-server/)
- `yarn build` - build the client side assets for production
- `yarn serve` - build the client side assets and start the express server that has SSR enabled

#### 2) Docker
Next is to validate the changes using the Docker container
```shell
$ docker build -t ssr .
$ docker run -p 3001:3001 -i -t ssr
```

Then open `localhost:3001` in your browser.