/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
  comments: [],
});

const PersonalLibraryFCC = mongoose.model("PersonalLibraryFCC", BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      try {

        const books = await PersonalLibraryFCC.find({});

        res.json(books.map((book) => ({
          title: book.title,
          _id: book._id,
          commentcount: book.commentcount
        })))

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    })

    .post(async (req, res) => {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        if (!title) {
          return res.json("missing required field title");
        }
        const newBook = new PersonalLibraryFCC({ title });
        const saveBook = await newBook.save();

        res.json({
          title: saveBook.title,
          _id: saveBook._id
        })



      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const allBooks = await PersonalLibraryFCC.deleteMany({});
        if (allBooks) {
          return res.json("complete delete successful")
        }


      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        if (!ObjectId.isValid(bookid)) {
          return res.json("no book exists");
        }

        const book = await PersonalLibraryFCC.findById(bookid);
        if (!book) {
          return res.json("no book exists");
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        })

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {

        if (!comment) {
          return res.json("missing required field comment");
        }
        if (!ObjectId.isValid(bookid)) {
          return res.json("no book exists");
        }
        const book = await PersonalLibraryFCC.findById(bookid);
        if (!book) {
          return res.json("no book exists");
        }
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        await book.save();

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        })

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        if (!ObjectId.isValid(bookid)) {
          return res.json("no book exists");
        }

        const book = await PersonalLibraryFCC.findByIdAndDelete(bookid);
        if (!book) {
          return res.json("no book exists");
        }

        res.json("delete successful")

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    });

};
