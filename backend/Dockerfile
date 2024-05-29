FROM node:latest

RUN mkdir -p /home/node/app/node_modules
RUN mkdir -p /home/node/app/input_files
RUN mkdir -p /home/node/app/output_files

WORKDIR /home/node/app

COPY package*.json ./
COPY server.js ./

RUN npm install

RUN chown -R node:node /home/node/app

USER node

COPY --chown=node:node . .

EXPOSE 8001

CMD [ "npm", "start" ]