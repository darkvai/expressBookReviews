const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    let exists = users.some((user)=> user.username === username)
    if(exists){
      res.json({message : "username already exists"})
    }
    else{
        users.push({"username" : username ,
      "password" : password
    });
      res.status(200).json({message: "Customer successfully registered"});
  }
  }
  else {
    res.status(400).json({message : "username and password missing"})
  }

});

public_users.get('/', function (req, res) {
  res.status(200).json(books);
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
});
  
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/');

    const books = response.data;

    const filtered = Object.entries(books)
      .filter(([isbn, details]) =>
        details.author.toLowerCase() === author.toLowerCase()
      )
      .map(([isbn, details]) => ({ isbn, ...details }));

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    const filtered = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (filtered.length > 0) {
      res.status(200).json(filtered);
    } else {
      res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn in books) {
    res.send(books[isbn].reviews);
  }
  else {
    res.status(404).json({message:"Book not found"});
  }
});


module.exports.general = public_users;
