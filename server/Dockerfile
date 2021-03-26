# base image
FROM node:14.16

#RUN apk add g++ make python

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install

# copy and start app
COPY server.js .
COPY utils/* ./utils
COPY postgres/DBqueries.js ./postgres/DBqueries.js
COPY postgres/DBqueriesKNEX.js ./postgres/DBqueriesKNEX.js
EXPOSE 3001
CMD ["npm", "start"]
