# Pull base image
FROM smebberson/alpine-nginx-nodejs:latest

# development: build as if web development will take place on Docker
# production: build as if production, so only public files will be deployed pre-built ready to run
# refer: line 17, if dev copy all, if prod copy public
ENV NODE_ENV=production NODE_PORT=4000

# Stream the nginx logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Build the npm modules
ADD package.json home/web-application/package.json
RUN cd home/web-application && npm install --production

# Add the files (works with .dockerignore to exclude /app/node_modules, so the above npm build isn't replaced)
ADD . home/web-application

# Run updates if any are required
RUN apk update
RUN apk upgrade

# Install bash
RUN apk add bash

# Install VIM for editing
RUN apk add vim

# Install IP tools if needed
# RUN apk iputils-ping