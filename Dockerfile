FROM node:8

# create app dir
WORKDIR /usr/src/CSI

# install app dependencies from package*.json

COPY package*.json ./
RUN npm install 

COPY . . 

EXPOSE 80
EXPOSE 9999
EXPOSE 10000
EXPOSE 10001
EXPOSE 10002
EXPOSE 10003
EXPOSE 10004

CMD [ "npm", "start" ]
CMD [ "node", "server.js" ]
