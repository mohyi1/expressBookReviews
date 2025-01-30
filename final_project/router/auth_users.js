const express = require('express');
var session = require('express-session')
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

  
let users = [
    {username: "Mohyeddine", password:"Password"}
];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(user => user.username === username);
    return user && user.password === password;}

//only registered users can login
regd_users.post("/login", (req,res) => {
    SECRET_KEY ="secret_key";
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT Token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  req.session.user = username;
  return res.status(200).json({ message: "Login successful", token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = req.session;
    const { review } = req.query;
    const { isbn } = req.params;
    if (!username) {
        return res.status(401).json({ message: "You must be logged in to post a review" });
    }
    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }
    if (!reviews[isbn]) {
        reviews[isbn] = [];
    }
    const existingReviewIndex = reviews[isbn].findIndex(r => r.username === username);
    
    if (existingReviewIndex >= 0) {
        reviews[isbn][existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        reviews[isbn].push({ username, review });
        return res.status(200).json({ message: "Review added successfully" });
    }

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session; 
    const { isbn } = req.params; 

    
    if (!username) {
        return res.status(401).json({ message: "You must be logged in to delete a review" });
    }

    
    if (!reviews[isbn]) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }

    
    const reviewIndex = reviews[isbn].findIndex(r => r.username === username);

    
    if (reviewIndex === -1) {
        return res.status(404).json({ message: "You haven't posted a review for this book" });
    }

    
    reviews[isbn].splice(reviewIndex, 1);

    
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
