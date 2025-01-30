const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios')
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const { username, password } = req.body;  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users[username] = { password };  
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});



public_users.get('/books', function (req, res) {
    
    axios.get('http://localhost:5000')  
      .then(response => {
        
        return res.status(200).json(response.data);
      })
      .catch(error => {
        
        return res.status(500).json({ message: 'Failed to fetch books', error: error.message });
      });
  });


  public_users.get('/book/:isbn', function (req, res) {
    const { isbn } = req.params;
  
    axios.get(`http://localhost:5000/isbn/${isbn}`)  
      .then(response => {
        
        return res.status(200).json(response.data);
      })
      .catch(error => {
        
        return res.status(500).json({ message: 'Failed to fetch book details', error: error.message });
      });
  });

  
  public_users.get('/books/author/:author', function (req, res) {
    const { author } = req.params;
  
    
    axios.get(`http://localhost:5000/author/${author}`)  
      .then(response => {
        
        return res.status(200).json(response.data);
      })
      .catch(error => {
        
        return res.status(500).json({ message: 'Failed to fetch books by author', error: error.message });
      });
  });  


  public_users.get('/book/title/:title', async function (req, res) {
    const { title } = req.params;
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
    
      return res.status(200).json(response.data);
    } catch (error) {
    
      return res.status(500).json({ message: 'Failed to fetch book details by title', error: error.message });
    }
  });
   

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" }); 
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // 
    const booksByTitle = Object.values(books).filter(book => book.title === title);
  
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); 
    } else {
      return res.status(404).json({ message: "No books found with this title" }); 
    }
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; 
  
    if (books[isbn]) {
      if (books[isbn].reviews = {}) {
        return res.status(200).json({'message': "No reviews found"});
      } else {
        return res.status(200).json(books[isbn].reviews);
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
