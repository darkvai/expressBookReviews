const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
      res.status(200).json({message : "user added"})
  }
  }
  else {
    res.status(400).json({message : "username and password missing"})
  }

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  
  try{
    const getbooks = ()=>{
      return new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(books);
        },100)
      })
    }
      let bbooks = await getbooks(); 
    res.status(200).send(JSON.stringify(bbooks, null,4));
  }
  catch(error){
    res.status().json({message : "Error retreiving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(isbn in books) {
    res.send(books[isbn]);
  }
  else {
    res.status(404).json({message:"Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let bookbyauth = [];
  let author = req.params.author;
  let keys = Object.keys(books);
  keys.forEach( key => {
    if(books[key].author === author) {
      bookbyauth.push(books[key]);
    }
  });
  res.send(bookbyauth);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookbytitle = [];
  let title = req.params.title;
  let keys = Object.keys(books);
  keys.forEach( key => {
    if(books[key].title === title) {
      bookbytitle.push(books[key]);
    }
  });
  res.send(bookbytitle);
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
