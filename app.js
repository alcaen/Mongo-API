// Imports

import { ObjectId } from "mongodb";
import express from "express";
import { connectToDb, getDb } from "./db.js";

// Init app & middleware

const app = express();

app.use(express.json());

// DB connection

let db;

connectToDb((err) => {
  // First connect to db then listen for request
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// Routes

// GET all books
// app.get("/books", (req, res) => {
//   let books = [];
//   db.collection("books") // => db.books equivalent
//     // cursor returned where we can apply two methods toArray or forEach
//     // it's returned in batches.
//     .find()
//     .sort({ author: 1 })
//     .forEach((book) => books.push(book))
//     .then(() => {
//       res.status(200).json(books);
//       // send status of ok and next to that send json of books
//     })
//     .catch(() => {
//       res.status(500).json({ error: "Could not fetch the documents" });
//       // send status not ok and an error
//     });
//   // res.json({ msg: "Welcome to the API" });
// });

// GET one book

app.get("/books/:id", (req, res) => {
  // First check if the id is valid for mongo (24Hex char long value)
  if (ObjectId.isValid(req.params.id)) {
    // Use books collection
    db.collection("books")
      // Find one to find only one by id
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

// POST a book

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create a new document." });
    });
});

// DELETE a book

app.delete("/books/:id", (req, res) => {
  // First check if the id is valid for mongo (24Hex char long value)
  if (ObjectId.isValid(req.params.id)) {
    // Use books collection
    db.collection("books")
      // Delete one to find only one by id
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not delete the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

// PATCH update individual documents

app.patch("/books/:id", (req, res) => {
  const updates = req.body;
  // First check if the id is valid for mongo (24Hex char long value)
  if (ObjectId.isValid(req.params.id)) {
    // Use books collection
    db.collection("books")
      // Delete one to find only one by id
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      //  In the second parametter we set what we wanna update in this case it oly changes what is required
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not update the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document id" });
  }
});

// Pagination

app.get("/books", (req, res) => {
  // current page
  const page = req.query.p || 0; // p stands for page
  const booksPerPage = 3; // Set it to what is wanted

  let books = [];
  db.collection("books") // => db.books equivalent
    // cursor returned where we can apply two methods toArray or forEach
    // it's returned in batches.
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
      // send status of ok and next to that send json of books
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
      // send status not ok and an error
    });
  // res.json({ msg: "Welcome to the API" });
});
