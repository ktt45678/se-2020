FROM node:14.15.4-buster

# Install graphics magick
RUN apt-get update && apt-get install -y graphicsmagick

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080 2222
CMD [ "node", "server.js" ]