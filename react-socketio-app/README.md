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

- the app loads on the Login page, where user can either sign in or sign up. Sign in has been tested agaist users already stored in db who already are linked with a set of rooms which are sent to them on succesful login in the "joined rooms" io event. Next the server fetches all the past messages of that user from DB and sends them back to the client in a "past messages" event. 
The client initializes the RoomList and ChatRoom components with the received list. All communication that follows is stored in the DB.
- new users can currently sign up, but if they log in with the new credentials they won't be able to communicate because the implementation of joining and creation of new rooms is in progress.


## In progress:

- users can create new rooms (and accept/reject other users wanting to join that room)
- new users are presented with a list of rooms they can join (rooms with recorded activity of other users)
- in db each room stores a record of userid who created it
- new user can click the room they wish to join and the join request will be sent to the user that created the room
- once the room creator accepts the request the confirmation is sent to the requesting user, and they can now interact with other users of that room

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
   - run npm run dev
   - go to localhost:3000 in at least two browser tabs to see the client to client communication
   - check db entries for user credentials and login with name that exists in db (passwords are same as names for testing);
   - log with another user credentials and test the room-room communication

   



