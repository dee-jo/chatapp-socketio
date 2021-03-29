# base image
FROM node:14.16

# set working directory
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install

# copy and start app
COPY server.js .
COPY utils/* ./utils
COPY postgres/DBqueries.js ./postgres/DBqueries.js
COPY postgres/DBqueriesKNEX.js ./postgres/DBqueriesKNEX.js
# COPY ./tmp/wait-for-DB.sh .

EXPOSE 3000
# CMD ["./wait-for-DB.sh", "database:5432", "--", "npm", "start"]
CMD ["npm", "start"]
