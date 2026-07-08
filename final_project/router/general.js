const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
  if (users.includes(username)) {
    return res.status(400).json({ message: 'User already exists' })
  } else {
    users.push({ username, password })
    return res.status(200).json({ message: 'User registered successfully' })
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
//  new Promise((resolve, reject) => {
//  resolve(JSON.stringify(books))
//  })
//  .then((data) => {
//   return res.status(200).json({ data })
//  })
//  .catch((error) => {
//    return res.status(400).json({ message: error })
//  })

  //return res.status(300).json({message: "Yet to be implemented"});
//});

public_users.get('/', async function (req, res) {
  //Write your code here
  console.log('hello m here');
  axios.get('http://localhost:5000/books').then(
    (responseBooks)=>{
      return res.status(200).send(JSON.stringify(responseBooks.data,null , 4));
    }
  ).catch(e=>
    res.status(404).send("cant get books <br>  "+ e)
    )
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//  new Promise((resolve, reject) => {
//    const isbn = req.params.isbn
//    const book = books[isbn]
//    if (!book) {
//      reject('Book not found')
//    } else {
//      resolve(book)
//    }
//  })
//    .then((data) => {
//      res.status(200).json(data)
//    })
//    .catch((error) => {
//      res.status(404).json({ message: error })
//    })
  //return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/isbn/:isbn', async function (req, res) {
  // Write your code here
  let isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');

    if (response.data[isbn]) {
      return res.status(200).send(JSON.stringify(response.data[isbn], null, 4));
    } else {
      return res.status(404).send("No book found with ISBN " + isbn);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //Write your code here
//  new Promise((resolve, reject) => {
//    const author = req.params.author
//    const booksByAuthor = Object.values(books).filter(
//      (b) => b.author === author
//    )
//    if (booksByAuthor.length === 0) {
//      reject('No books found for this author')
//    } else {
//      resolve(booksByAuthor)
//    }
//  })
//    .then((data) => {
////      res.status(200).json(data)
//    })
//    .catch((error) => {
//      res.status(404).json({ message: error })
//    })
  //return res.status(300).json({message: "Yet to be implemented"});
//});

public_users.get('/author/:author', async function (req, res) {
  // Write your code here
  let author = req.params.author;
  let booksByAuthor = [];

  try {
    // Assuming the API endpoint for getting all books is http://localhost:5000/books
    const response = await axios.get('http://localhost:5000/books');

    for (let isbn in response.data) {
      if (response.data[isbn].author == author) {
        booksByAuthor.push(response.data[isbn]);
      }
    }

    if (booksByAuthor.length > 0) {
      return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      return res.status(404).send("No book found with author " + author);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
  //Write your code here
//  new Promise((resolve, reject) => {
//    const title = req.params.title
//    const booksByTitle = Object.values(books).filter((b) =>
//      b.title.includes(title)
//    )
//    if (booksByTitle.length === 0) {
//      reject('No books found with this title')
//    } else {
//      resolve(booksByTitle)
//    }
//  })
//    .then((data) => {
//      res.status(200).json(data)
//    })
//    .catch((error) => {
//      res.status(404).json({ message: error })
//    })
  //return res.status(300).json({message: "Yet to be implemented"});
//});

public_users.get('/title/:title', async function (req, res) {
  // Write your code here
  let title = req.params.title;
  let booksByTitle = [];

  try {
    // Assuming the API endpoint for getting all books is http://localhost:5000/books
    const response = await axios.get('http://localhost:5000/books');

    for (let isbn in response.data) {
      if (response.data[isbn].title == title) {
        booksByTitle.push(response.data[isbn]);
      }
    }

    if (booksByTitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      return res.status(404).send("No book found with title " + title);
    }
  } catch (error) {
    // Handle errors, e.g., network issues or API errors
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book || !book.reviews) {
    return res.status(404).json({ message: 'Reviews not found for this book' })
  }
  return res.status(200).json(book.reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
