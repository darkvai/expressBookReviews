const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let exists = users.find((user) => user.username === username);
  if(exists != null){
    if(exists.password ===password){
      return true;
    }
    else {
      return false;
    };
  }
  else{
    return null;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data : password 
    },"access",{'expiresIn': 60*60})

    req.session.authorization = {accessToken , username};
    res.status(200).json({message : "User logged in successfully"});

  }
  else {
    res.status(208).json({message: "invalid login credentials"})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];

  if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization['username'];

  if (books[isbn]) {
      let book = books[isbn];
      if (book.reviews[username]) {
          delete book.reviews[username];
          return res.status(200).send(`Reviews for the ISBN ${isbn} posted by user ${username} deleted.`);
      } else {
          return res.status(404).json({ message: "No review found for this user on this book" });
      }
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
