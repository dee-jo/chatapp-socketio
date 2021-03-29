FROM node:14.16
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install

COPY index.js .
EXPOSE 3000
CMD ["npm", "start"]