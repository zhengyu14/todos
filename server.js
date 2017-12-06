'use strict';

const Hapi = require('hapi');
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
 });

// Connection URL
const url = 'mongodb://localhost:27017/test';
const statusNew = 'NEW';
const statusCompleted = 'COMPLETED';

// Create a new todo item
server.route({
  method: 'POST',
  path:'/create/{title}',
  handler: function (request, reply) {

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var database = db.db("todos");
      var newTodo = {
        name:encodeURIComponent(request.params.title),
        status:'NEW'
      }
      // Insert a single document
      database.collection("todos").insertOne(newTodo, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
      });
    });

    return "ok";
  }
});

// Get a list of todos
server.route({
    method: 'GET',
    path:'/findall',
    handler: function (request, reply) {
      var result;
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        var database = db.db("todos");
        // Insert a single document
        database.collection("todos").find({}).toArray(function(err, r) {
          assert.equal(null, err);
          result = r;
        });
      });
      return result;
    }
});

// Delete a completed todo item
server.route({
    method: 'DELETE',
    path:'/delete/{id}',
    handler: function (request, reply) {
        var myquery = { _id: encodeURIComponent(request.params.id)}
        db.collection.deleteOne(myquery, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.deletedCount);
          });
    }
});

// Update a todo item
server.route({
    method: 'POST',
    path:'/update',
    handler: function (request, reply) {

        return 'hello world';
    }
});

// Search for a todo item
server.route({
    method: 'GET',
    path:'/search',
    handler: function (request, reply) {

        return 'hello world';
    }
});



// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
