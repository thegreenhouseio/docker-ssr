![](https://www.docker.com/sites/default/files/horizontal.png)
# docker-ssr
A repository demonstrating the usage of **Docker** to containerize a Server Side Rendering (**SSR**) runtime for a web application; in this case [a simple **React** counter app using **Redux** and built with **webpack**](https://redux.js.org/recipes/serverrendering).

> This project is currently a [work in progress](https://github.com/thegreenhouseio/docker-ssr/projects) as I continue to refactor the implementation to use a _docker-compose.yml_ file so as to be more configuration driven and reusable in way that it can be published to Docker Hub and used within other projects.  The React app included in the repo is here for convenience and testing / development purposes and not part of the implementation.

## Building A Better Mouse Trap
![](https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX2831761.jpg)

Most Server Side Rendered applications I've typically seen couple client and server related code and dependencies into one codebase.  While this in and of itself isn't a bad thing per se, there are some pain points that always stuck out to me from the perspective of a developer and DevOps "enthusiast".  

Let me walk through an example that I think will help demonstrate my point by taking a look at the dependencies of a **React** app built with **webpack** (like the one in this repo).  
```json
{
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-redux": "^5.0.6",
    "redux": "^3.7.2"
  },
  "devDependencies": {
    "@babel/cli": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^7.1.2",
    "eslint": "^4.17.0",
    "eslint-plugin-react": "^7.6.1",
    "html-webpack-plugin": "^2.30.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.11.1",
    "webpack-merge": "^4.1.1"
  }
}
```

As expected, we have our frontend packages captured as `dependencies` since they are directly used within our frontend code, and our build tools as `devDependencies`.

Now to add SSR rendering, say an Express server and any of its related packages, we would need to add that to _package.json_.  For example:
```json
"@babel/core": "^7.0.0",
"@babel/node": "^7.0.0",
"express": "^4.16.2",
"pm2": "^2.7.2",
```

But where?  It's not used in our codebase so it doesn't fit in `dependencies`, and it's not part of our build pipeline, so `devDependencies` doesn't really fit either... 

> Yeah, but aren't you just debating semantics though?


### The Case For Contaienrs
In my mind, the oppourtunity here is not in just a "cleaner" or more semantic _package.json_.  Instead of thinking of SSR as a _dependency_, we could think of it as what it really is; a _runtime / environment_.  

I've alaways felt that in a world of DevOps, Containers, and Micro Services, where more and more environment and runtime responsibilities are being deferred to [infrastucture as code](https://en.wikipedia.org/wiki/Infrastructure_as_Code) tools like [Terraform, Ansible, Chef and, of course, Docker](https://www.thorntech.com/2018/04/15-infrastructure-as-code-tools/), that we could tap into that ecosystem to help us improve the developer experience of developing a SSR application.

If we do, I think we open up teams to a lot of great strategic and tactical oppourtunities:
- With **Docker**, the server and all its dependencies are "baked into the cake" and simply a pull away from a Docker Hub.
- An application can start as intended for static deployment (S3, FTP, etc) and from there  an SSR environment can added without significant impact to operations and local development workflowa.
- Minimize and compartmentalize the maintenance of non-application related dependencies by moving them to a centralized repository for maintaing the Docker container.
- Projects can still manage and configure (to an extent) their runtime code (_server.js_, **webpack** build) and compose their own dependencies into the environment for specific one-off customizations
- **Docker** is a great tool for local development environments and workflows, and so local testing of SSR is simple and would be known to work the same as it would in production.
- Managing an environment through a **Docker** container makes it easy to add and abstract away complex infrastucture configuration like healthchecks, monitoring, logging (and more!) without having to complicate local development or make changes in a lot of projects.

Ok, so enough selling, I'm mainly just excited to tell you how it works!  🌟

## Usage
> This project's progress is currently on track for an MVP status by 10/13/2018 for [my presentation at Node+JS Interactive](https://jsi2018.sched.com/event/F76V?iframe=no)).  Only the Dockerfile approach is usable right now, but please [follow our progress](https://github.com/thegreenhouseio/docker-ssr/milestone/2) and feel free to comment and provide feedback!


### Dockerfile
This repository includes a working Dockerfile that implements the sample **React** app included in the repo.  A breakdown is provided below, with comments provided inline to describe all the commands.
```shell
FROM ubuntu:16.04

# install NodeJS, Yarn, SSR packages (express and babel)
RUN apt-get update \ 
    && apt-get install -y curl vim git bzip2 ssh \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@^1.0.0 && yarn global add @babel/core@~7.0.0 @babel/node@~7.0.0 @babel/preset-react@~7.0.0 @babel/preset-env@~7.0.0

############
# Generally everything above would be published as a Docker image and the rest 
# would be specific to the Dockerfile or docker-compose.yml for the project.
############

# mount the host project root to root of the container
COPY . ./

# call any needed build tasks of the host project, e.g. install deps, run webpack
RUN yarn install && yarn build

# set the working directory of the container
WORKDIR ./app

# get the build output and mount it
COPY ./dist ./static

# get the project's src/ and mount it
COPY ./src ./src

# get the project's server.js and mount it
COPY ./server.js ./

# expose the port of the Express server (from server.js)
# TODO make port configurable
EXPOSE 3001

# TODO make additional params configurable
# Start the express server when the container is started
CMD ["babel-node", "--presets=@babel/preset-react,@babel/preset-env", "server.js"]
```

Here are the things you would need to configure depending on your project's setup:
1. `yarn global add` - this is where you would want to change the dependencies for your particular SSR stack
1. `RUN yarn install && yarn build` - the installation and build tasks for your project.  Generally this will be your webpack build.  See this repositories _package.json_ for more details on what they do in this particular setup.
1. `COPY ./dist ./static` - Change the _first_ path to wherever your build outputs files to, e.g. _static/_, _public/_, _build/_, etc.
1. `COPY ./src ./src` - Change the _first_ path to wherever your source files are (e.g. your webpack entry point).
1. _server.js_ - Your project's SSR entry point. 
1. `EXPOSE 3001` - the port configured for Express in _server.js_
1. `CMD ["babel-node", ...]` - add any additional presets you may need that you installed in step 2

For reference, the filesystem on the container will look like this:
```shell
/
  - all files from the repo)
  - /app
      src/
      static/
      server.js
```

Naturally this isn't as elegant as a compose file, but it proves enough of the concept that I think it makes a compelling starting point and shouldn't take too long to refactor.  

> For what the ideal usage being worked on would look like, see the usage in the section below.  👇

### ⚠️ Docker Compose (IN PROGRESS)
Ideally in the end the goal is to arrive at a point where a [_docker-compose.yml_](https://docs.docker.com/compose/) file can be used instead, to support a more declarivate and efficient way of configuring the SSR container from "the outside" / userland.  

The anticipated usage would look something like this:
```yml
app:
  image: our-custum-ssr-image
  ports:
    - 3001:3001
  environment:
    PATH_STATIC: './dist',
    PATH_SRC: './src'
    PATH_SERVER: './server.js'
```

## Development
This repository provides a [**React**](https://reactjs.org/) project built with [**webpack**](https://webpack.js.org/) for development / testing purposes.  The intent is to act as a [fixture]() for what's defined in _Dockerfile_.

### Setup
1. [ ] Install [**Docker**](https://www.docker.com/products/docker-desktop)
1. [ ] Install [**NodeJS**](https://nodejs.org/en/) v8.x
1. [ ] Optionally, install [**Yarn**](https://yarnpkg.com/en/docs/install) 1.x

### Workflow
Development is mainly a two step process:

#### 1) UI Application
Develop with the React project and validate using available **npm** scripts (**Yarn** or **npm** supported):

- `yarn lint` - lint the project source code
- `yarn develop` - test changes with [**webpack-dev-server**](https://webpack.js.org/configuration/dev-server/)
- `yarn build` - build the client side assets for production
- `yarn serve` - build the client side assets and start the express server that has SSR enabled (without Docker)

#### 2) Docker
To validate the changes using the Docker container, first build the container
```shell
$ docker build -t ssr .
```

Then you can start it and view it at `http://localhost:3001`
```shell
$ docker run -p 3001:3001 -i -t ssr
```

Or SSH into it to explore around after you've started it.  All files mounted are relative to `/`.
```shell
$ docker exec -it <ssr-app> bash
```

> See [this repo](https://github.com/thegreenhouseio/docker-nodejs-dev#development) for some additional Docker related workflows and commands.