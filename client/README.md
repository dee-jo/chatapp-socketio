# Socketio Chat-App (in progress)

This app is my portfolio project in progress. It's my learning outlet where I document every step of the process, the problems I encounter, experiment with different apis, refactor, grind through the bugs and find a way to solve them. 

## The idea

Multi-client, real-time chat application based on web-sockets connections that are managed on a server. Clients categorize their communications in rooms. Users are authenticated in order to use the app and their conversations are stored in db.

## Technologies used

- Front-end: React
- Back-end: node/express
- DB: Postgres

## Libraries
- WebSockets: socketio
- Authentication: socketio-auth

## The current functionality

- the app loads on the Login page, where user can either sign in or sign up. 
- in case of the sign up, the request is sent to server and user's details stored in db
- in case it's a login, username and password are checked against user credentials stored in db
- on successful login user is either sent a list of rooms they previously joined, or a list of available rooms
- a user can request to join a room from the list of available rooms, and the request will be sent to room administrator
- once the room administrator confirms the request, the user will be sent a list of past communications in that room and will be able to comunicate with other users of that room (this will be later restricted to only past messages starting at the date that user joined the room)


## In progress:
- users can message other users directly
- users can create new rooms and (and become administrators of that room - accept/reject other users wanting to join)


## Further functionality:

- implement video calls with webRTC
- users can send multi-type files like photos, videos etc.
- implement Nginx load balancer that will redirect traffic to multiple socketio servers, implement Kafka pubsub streaming so that each io server could subscribe to all existing Kafka topics and push messages from clients to Kafka according to topic (room). Then create a DB service to also subscribe to all kafka's topicks and store the data on each new notification.

## Run the project (requires running Postgres server):

- clone the GitHub repo and cd into chatapp-socketio and then into chatapp-socketio-app
- run npm install
- cd into the server:
   - run npm install
   - run node populate.js (this will create and populate DB with dummy users, rooms and messages) 
   - open the file and:
      - comment line 309, and uncomment lines 289, 311-320, save
      - run node populate.js again (this will populate the DB)
   - cd back to the client ../
   - run 'npm run dev'
   - go to localhost:3000 in at least two browser tabs to see the client to client communication