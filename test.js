'use strict';

const Hapi = require('hapi');
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
 });

// MongoDB service URL
const url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  var database = db.db("todos");

  // Create a new to-do item (OK)
  server.route({
    method: 'POST',
    path:'/create/{title}',
    handler: function (request, reply) {
      var newTodo = {
        title: request.params.title
        , status: "NEW"
      }

      database.collection("todos").insertOne(newTodo, function(err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
      });

      var response = "New to-do item created: "
        + encodeURIComponent(request.params.title)
        + ", with status: NEW.";
      return response;
    }
  });

  // Find all to-do items
  server.route({
    method: 'GET',
    path:'/read',
    async handler(request, reply) {
      var response;

    await database.collection("todos").find({}).toArray(function(err, r) {
        assert.equal(null, err);
        console.log(r);;
      });
      return "Please find all to-do items in console.";
    }
  });

  // Update a to-do item to completed stauts (OK)
  server.route({
    method: 'POST',
    path:'/update/{title}',
    handler: function (request, reply) {
      var target = {
        title: encodeURIComponent(request.params.title)
        , status: "NEW"
      };
      var updateInfo = {
        $set:{
          status: "COMPLETED"
        }
      };

      database.collection("todos").updateOne(target, updateInfo, function(err, r) {
        assert.equal(null, err);
      });

      var response = "To-do item: "
        + encodeURIComponent(request.params.title)
        + " is completed.";
      return response;
    }
  });

  // Delete a completed to-do item
  server.route({
    method: 'DELETE',
    path:'/delete/{title}',
    handler: function (request, reply) {
      var target = {
        title:encodeURIComponent(request.params.title),
        status:'COMPLETED'
      };

      database.collection("todos").findOneAndDelete(target, function(err, r) {
        assert.equal(null, err);
      });

      var response = "To-do item: "
        + encodeURIComponent(request.params.title)
        + " is deleted."
      return response;
    }
  });

  // Search for a to-do item
  server.route({
      method: 'GET',
      path:'/query',
      handler: function (request, reply) {
        var queryTarget
        if (request.query.title) {
          queryTarget ={
            title: encodeURIComponent(request.query.title)
          }
        } else if (request.query.status) {
          queryTarget ={
            status: encodeURIComponent(request.query.status)
          }
        } else if (request.query.title && request.query.status) {
          queryTarget ={
            title: encodeURIComponent(request.query.title)
            , status: encodeURIComponent(request.query.status)
          }
        }

        if (queryTarget) {
          database.collection("todos").find(queryTarget).toArray(function(err, r) {
            assert.equal(null, err);
            console.log(r);
            return r;
          })

          return "Please find the query results in console.";
        } else {
          return "No hit."
        }

      }
  });

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
