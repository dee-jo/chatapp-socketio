# Socketio Chat-App (in progress)

This app is a future portfolio project, where I document every step from the initial idea through the entire implementation evolution.

## The idea

Multi-client, real-time chat application based on web-sockets connections that are managed on a server. Clients categorize their communications in rooms.

## Technologies used

- Front-end: React
- Back-end: node/express
- WebSocket library: socketio
- DB: Postgres

## The current functionality

- the app loads on the Login page (user verification not yet functional, defaults to 'user5' at present). The io client connects to the server on clicking the submit button.
- the server looks up for the client in the DB and fetches the list of rooms the client has previously interacted with. It sends them to client in the "joined rooms" io event. The server then fetches all the past messages of that user from DB and sends them back to the client in a "past messages" event. 
- the client initializes the RoomList and ChatRoom components with the received list. 
- all communication that follows is stored in the DB.

## In progress:

- user authentication
- users can create new rooms (and accept/reject other users wanting to join)
- implement video calls with webRTC
- users can send multi-type files like photos, videos etc.
- implement Nginx load balancer that will redirect traffic to multiple socketio servers, implement Kafka pubsub streaming so that each io server could subscribe to all existing Kafka topics and push messages from clients to Kafka according to topic (room). Then create a DB service to also subscribe to all kafka's topicks and store the data on each new notification.

## Run the project (requires running Postgres server):

- clone the GitHub repo and cd into chatapp-socketio and then into chatapp-socketio-app
- run npm install
- cd into the server:
   - run npm install
   - run node populate.js (this will create the DB) 
   - open the file and:
      - comment line 309, and uncomment lines 289, 311-320, save
      - run node populate.js again (this will populate the DB)
   - cd back to the client ../
   - run npm run dev
   - go to localhost:3000 in at least two browser tabs to see the client to client communication

   



