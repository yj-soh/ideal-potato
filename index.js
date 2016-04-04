'use strict';

const Hapi = require('hapi');
var rfr = require('rfr');
var Db = rfr('app/models/db');
const server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        index: 'index.htm'
      }
    }
  });
});
