# docker-ssr
A Docker container that mounts a local webpack build and server-side renders it.

## Overview
Server-side rendered applications often couple client and server code into one codebase.  I prefer to keep my frontend builds distinct from the backend implementation.  Static files are just static files and should be easily deployed to a webserver or S3, via FTP or SSH, whatever.  

So rather than mix `client` and `server` code and dependencies in one repository, I've created a Docker container that provides a SSR runtime environment and will just mount your `build` output directory (say a React app w/webpack) allowing you to `docker-compose` your frontend and share your SSR runtime between all your apps.  Yessssss..........

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

## Development
The project provides a React project built by webpack in this repository for development / testing purposes.

To develop for this project first run `yarn install`

- `yarn lint` - lint the project
- `yarn develop` - test client changes on webpack-dev-server (`http://localhost:3001`)
- `yarn build` - build the client side assets only 
- `yarn serve` - build the client side assets and start the express SSR server (`http://localhost:3001`)