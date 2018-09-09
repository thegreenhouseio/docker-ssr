FROM ubuntu:16.04

# install express and babel packages globally
# TODO allow for user defined presets / dependencies?  e.g. react
# 
RUN apt-get update \ 
    && apt-get install -y curl vim git bzip2 ssh \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@^1.0.0 && yarn global add @babel/core@~7.0.0 @babel/node@~7.0.0 @babel/preset-react@~7.0.0 @babel/preset-env@~7.0.0

# mount the host workspace / repository to root of the container
COPY . ./

# build the host web app and get bundling dealt with before mounting
# TODO provide as a configurable build script?  ssr:hook:setup
# allow additional dependenecies this way?
# TODO could this come after WORKDIR?
# https://github.com/thegreenhouseio/docker-ssr/issues/3
RUN yarn install && yarn build

WORKDIR ./app

# get the build files
# TODO make this configurable
# https://github.com/thegreenhouseio/docker-ssr/issues/8
COPY ./dist ./static

# get the project's src/ directory and mount it
# TODO make this configurable
# https://github.com/thegreenhouseio/docker-ssr/issues/11
COPY ./src ./src

# get the project's server.js and mount it
# TODO make this configurable
# https://github.com/thegreenhouseio/docker-ssr/issues/12
COPY ./server.js ./

# expose the port configured in server.js
# TODO make port configurable
# https://github.com/thegreenhouseio/docker-ssr/issues/13
EXPOSE 3001

# TODO make additional params configurable
# https://github.com/thegreenhouseio/docker-ssr/issues/14
CMD ["babel-node", "--presets=@babel/preset-react,@babel/preset-env", "server.js"]