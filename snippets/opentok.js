/*
==== Regular Dependencies (use 'npm i'): ====
opentok
@opentok/client

*/

// ==== Server Side ====


// ==== In server/index.js ====
// npm i https
//
const express = require('express');
const https = require('https')
const fs = require('fs')

const app = express()

// Start listening (and create a 'server' object representing our server)
// Need to generate the server.key and server.crt files
// Put the server.key and server.crt files in the server folder

const certOptions = {
  // key: fs.readFileSync(path.resolve('server.key')),
  // cert: fs.readFileSync(path.resolve('server.crt'))
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}

// Set server to HTTPS which is required for browsers to do video
const server = https.createServer(certOptions, app).listen(443, () => {
  // console.log(`You're app is now ready at http://localhost:${PORT}/`);
  console.log(`You're app is now ready at https://localhost`);
})


// ==== In server/socket/opentok.js: ====
const helper = require('../helper');
const OpenTok = require('opentok');

// Verify that the Tok API Key and API Secret are defined
const apiKey = process.env.TOK_API_KEY,
  apiSecret = process.env.TOK_API_SECRET;
if (!apiKey || !apiSecret) {
  console.log(
    'You must specify TOK_API_KEY and TOK_API_SECRET environment variables'
  );
  process.exit(1);
}

module.exports.apiKey = apiKey

const tok = new OpenTok(apiKey, apiSecret);

module.exports.createSession = async () => {
  console.log('createSession(). Creating a Tok session...');
  const waitForSessionInfo = new Promise((resolve, reject) => {
    // The session will the OpenTok Media Router:
    const sessionOptions = {
      mediaMode: 'relayed'  // routed (through tokbox servers); relayed (P2P)
    }
    tok.createSession(sessionOptions, function(err, session) {
      if (err) {
        reject(err);
        return console.log(err);
      }

      const sessionId = session.sessionId;
      console.log('Tok sessionId:', helper.hashStr(sessionId));
      // const token = tok.generateToken(sessionId);
      // console.log('Tok token:', helper.hashStr(token));

      // resolve([sessionId, token]);
      resolve(sessionId);
    });
  });
  const sessionId = await waitForSessionInfo;
  console.log(
    'waited for creation of sessionId and token. sessionId:',
    helper.hashStr(sessionId)
    // 'token:',
    // helper.hashStr(token)
  );
  return sessionId
};

module.exports.createToken = sessionId => {
  return tok.generateToken(sessionId);
};




// ==== In server/socket/index.js ====
const { apiKey, createSession, createToken } = require('./opentok');

const socketIdMap = {};
/*
Holds a map of roomIds to tok sessionIds
*/
const roomIdMap = {};

const getTokData = socket => socketIdMap[socket.id].tokData;

const setupAndSendTokFeedToClient = async (socket, clientId, roomId) => {
  // sessionId will be the same for clients in the same room
  // Try to look for an existing tok session associated with the room
  let sessionId = roomIdMap[roomId];
  if (!sessionId) {
    sessionId = await createSession();
    roomIdMap[roomId] = sessionId;
  }
  // token will be different for every client
  const token = createToken(sessionId);
  console.log(
    'In sockets connection. sessionId:',
    helper.hashStr(sessionId),
    'token:',
    helper.hashStr(token)
  );

  // Video feed: send tok apiKey, sessionId, token
  sendTokFeedToClient(socket, clientId, apiKey, sessionId, token);
  return [sessionId, token];
};

module.exports = io => {
  io.on('connection', async serverSocket => {
    console.log(
      `A socket connection to the server has been made: ${serverSocket.id}`
    );

    registerSocketListeners(serverSocket);

    const existingSocketData = socketIdMap[serverSocket.id];
    if (existingSocketData) {
      console.error('Existing socket data with id:', serverSocket.id);
    }

    const clientId = serverSocket.id
    // Set up video feed info
    const [sessionId, token] = await setupAndSendTokFeedToClient(
      serverSocket,
      clientId,
      game
    );

    // Save all this data to the socketIdMap
    socketIdMap[serverSocket.id] = {
      socket: serverSocket,
      tokData: { sessionId, token },
    };

  });
};





// ==== Client Side ====

// ==== In client/socket/opentok.js: ====
import OT from '@opentok/client';
import store from '../store'
import {setThisVideo} from '../store/thisVideoElem'
import {setPlayersVideo} from '../store/playersVideoElem'

const createPubOptions = (playerId) => ({
  publishAudio: true,
  publishVideo: true,
  width: 50,  // Change these vals?
  height: 50,
  resolution: '320x240', // Supports: 1280x720; 640x480 (default); 320x240
  name: playerId, // Set to playerId. Subscribers can access event.stream.name
  style: { nameDisplayMode: 'auto' },  // or 'off'
  insertDefaultUI: false,   // Going to stick the DOM elem where we want it later
});

const createSubOptions = () => ({
  width: 50,
  height: 50,
  style: { nameDisplayMode: 'auto' },  // or 'off'
  insertDefaultUI: false, // Going to stick the DOM elem in later
});

// This function runs when session.connect() asynchronously completes
const sessionConnected = (session, publisher) => {
  return event => {
    console.log(
      'session.connect() has completed. tok sessionConnected. event:',
      event
    );
    // Publish the publisher we initialzed earlier (this will trigger 'streamCreated' on other
    // clients)
    session.publish(publisher);
  };
};

const subscriberVideoElementCreated = (playerId) => {
  return event => {
    console.log('In publisher subscriberVideoElementCreated(). event:', event, 'event.element:', event.element)
    store.dispatch(setPlayersVideo(playerId, event.element))
  }
}

// Triggers when other ppl publish their streams to this session
const streamCreated = session => {
  return event => {
    console.log(
      'another client has executed session.publish(). tok streamCreated. event:',
      event
    );

    // event.stream.name is on this event. Set to be the playerId
    // Subscribe to the stream that caused this event, put it inside the container we just made
    const subscriber = session.subscribe(event.stream, null, createSubOptions());
    console.log('subscriber:', subscriber)
    subscriber.on('videoElementCreated', subscriberVideoElementCreated(event.stream.name))
  };
};

const streamPropertyChanged = (session) => {
  return event => {
    console.log('received streamPropertyChanged event. event:', event);
  };
};

const videoElementCreated = (session) => {
  return event => {
    console.log('In publisher videoElementCreated(). event:', event, 'event.element:', event.element)
    store.dispatch(setThisVideo(event.element))
  }
}



const setupEventHandlers = (session, publisher) => {
  // Attach event handlers to session, publisher, and subscriber.
  publisher.on('videoElementCreated', videoElementCreated(session))
  session.on({
    // This function runs when session.connect() asynchronously completes
    sessionConnected: sessionConnected(session, publisher),

    // This function runs when another client publishes a stream (eg. session.publish())
    streamCreated: streamCreated(session),
    streamPropertyChanged: streamPropertyChanged(session),
  });
};

const setupOT = (playerId, apiKey, sessionId, token) => {
  // Initialize an OpenTok Session object
  const session = OT.initSession(apiKey, sessionId);

  // const replacementElemId = 'publisher';
  // Initialize a Publisher, and place it into the element with id="publisher"
  // const publisher = OT.initPublisher(replacementElemId, pubOptions);
  const publisher = OT.initPublisher(null, createPubOptions(playerId));

  // Set up publishing and subscribing
  setupEventHandlers(session, publisher);

  // Connect to the Session using the 'apiKey' of the application and a 'token' for permission
  session.connect(token);
};

export default setupOT;




// ==== ====
// After receiving apiKey, sessionId, and token, can set up tok
import setupOT from './opentok';
import store from '../store';
import { gotTokDataFromServer } from '../store/tokdata';

export const handleGotTokFeed = data => {
  const [playerId, apiKey, sessionId, token] = data;
  console.log(
    'Received TOK msg from server. apiKey:',
    apiKey,
    'sessionId:',
    sessionId,
    'token:',
    token
  );
  setupOT(playerId, apiKey, sessionId, token);
  console.log('Dispatching tokData to redux');
  store.dispatch(gotTokDataFromServer(apiKey, sessionId, token));
};


// ==== In client/store/tokdata.js: ====
// =========== Actions ============
const GOT_TOKDATA_FROM_SERVER = 'GOT_TOKDATA_FROM_SERVER';

// =========== Action Creators ============
export const gotTokDataFromServer = (apiKey, sessionId, token) => ({
  type: GOT_TOKDATA_FROM_SERVER,
  apiKey,
  sessionId,
  token,
});

// =========== Reducers ============
const initTokData = {
  apiKey: '',
  sessionId: '',
  token: ''
}

const tokDataReducer = (tokData = initTokData, action) => {
  switch (action.type) {
    case GOT_TOKDATA_FROM_SERVER:
      return ['apiKey', 'sessionId', 'token'].reduce((accum, key) => {
        accum[key] = action[key];
        return accum
      }, {});
    default:
      return tokData;
  }
};

export default tokDataReducer
