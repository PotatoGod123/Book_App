'use strict';

// bring in our dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');


// configure env file to allow variables to be listened to
require('dotenv').config();

// create port - process.env object - process is a dotenv method
const PORT = process.env.PORT || 3000;

// start express application
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
// CORS
client.connect();

app.use(cors());

client.on('error', err => {
  console.error(err);
});
// just files to always send to user, the css in this case
app.use(express.static('./public'));

// decode our POST data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));// allows two more actions on forms, PUT and DELETE method

//where the server will look for pages to serve the browser, set default view engine and what we're using to view (ejs)
app.set('view engine', 'ejs');

// routes
app.get('/', home);
app.get('/searches/new', newSearch);
app.post('/searches', bookSearch);
app.get('/books/:id', viewDetails);
app.post('/books/add', addBooktoData);
app.put('/update/:id', updateBook);
app.delete('/delete/:id', deleteBook);
app.get('/error', errorHandler);

// Handlers
function home(request, response) {
  let SQL = 'SELECT * FROM books';

  client.query(SQL)
    .then(results => {
      response.status(200).render('pages/index', { 'books': results });
    }).catch(err=>{
      console.log(err);
    });

}

function deleteBook(request, response) {
  const SQL = 'DELETE FROM books WHERE id = $1';

  const safeVal = [request.params.id];
  client.query(SQL, safeVal)
    .then(data => {
      console.log(data.rowCount);
      response.status(200).redirect('/');
    }).catch(err=>{
      console.log(err);
    });
}

function updateBook(request, response) {
  const SQL = 'UPDATE books SET title=$1, author=$2, description=$3, isbn=$4, image=$5, bookshelf=$6 WHERE id=$7';

  const body = request.body;
  const safeValues = [body.title, body.author, body.description, body.isbn, body.image, body.bookshelf, request.params.id];

  client.query(SQL, safeValues)
    .then(data => {
      console.log(data.rowCount);
      viewDetails(request, response);
    }).catch(err => {
      console.error(err);
    });

}

function newSearch(request, response) {
  response.status(200).render('pages/searches/new');
}

function addBooktoData(request, response) {
  const obj = request.body;

  const SQL = 'INSERT INTO books (title,author,description,isbn,image,bookshelf) VALUES ($1,$2,$3,$4,$5,$6)';

  const safeVal = [obj.title, obj.author, obj.description, obj.isbn, obj.image, obj.bookshelf];
  client.query(SQL, safeVal)
    .then(() => {
      response.status(200).render('pages/books/show', { book: obj, flag:'details' });
    }).catch(err=>{
      console.log(err);
    });
}

function bookSearch(request, response) {
  let search = request.body.search[0];
  let searchCategory = request.body.search[1];
  let queryParams = {
    limit: 10
  };

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
  if (searchCategory === 'title') {
    url += `+intitle:${search}`;
  }
  if (searchCategory === 'author') {
    url += `+inauthor:${search}`;
  }

  superagent.get(url)
    .query(queryParams)
    .then(results => {
      let returned = results.body.items;
      let arr = returned.map((bookResults) => {
        return new Book(bookResults);
      });
      response.status(200).render('pages/searches/show', { results: arr, flag: 'search' });
    }).catch(error => {
      console.log(error);
    });
}

function viewDetails(request, response) {
  let SQL = 'SELECT * FROM books WHERE id=$1';

  const safeParam = [request.params.id];



  client.query(SQL, safeParam)
    .then(results => {
      response.status(200).render('pages/books/show', { book: results.rows[0], flag: 'details' });
    }).catch(err=>{
      console.log(err);
    });
}
// error handler
function errorHandler(request, response) {
  response.status(500).render('pages/error');
}

// constructor function
// properties needed: image, title name, author name, book description (under volumeInfo)
function Book(obj) {
  this.image = obj.volumeInfo.imageLinks ? obj.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = obj.volumeInfo.title ? obj.volumeInfo.title : 'Title not available';
  this.author = obj.volumeInfo.authors ? obj.volumeInfo.authors : 'Author(s) not available';
  this.description = obj.volumeInfo.description ? obj.volumeInfo.description : 'Description not available';
  this.isbn = obj.volumeInfo.industryIdentifiers ? obj.volumeInfo.industryIdentifiers[0].identifier : 'N/A';
  this.bookshelf = obj.volumeInfo.categories ? obj.volumeInfo.categories[0] : 'No Categories';
}


app.listen(PORT, () => {
  console.log(`hi you are on port ${PORT}`);
  console.log(`hello you are connect to database>> ${client.connectionParameters.database}`);
});
