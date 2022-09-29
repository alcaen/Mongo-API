import { MongoClient } from "mongodb";

let dbConnection;

//Function to connect to database

const connectToDb = (cb) => {
  MongoClient.connect("mongodb://localhost:27017/bookstore") // KEY
    .then((client) => {
      dbConnection = client.db();
      return cb();
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

// Function to get database

const getDb = () => dbConnection;

export { connectToDb, getDb };
