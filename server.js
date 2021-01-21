'use strict';

// bring in our dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');


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
// where the server will look for pages to serve the browser
app.use(express.static('./public'));

// decode our POST data
app.use(express.urlencoded({ extended: true }));

// set default view engine and what we're using to view (ejs)
app.set('view engine', 'ejs');

// routes
app.get('/', home);
app.get('/searches/new', newSearch);
app.post('/searches', bookSearch);
app.get('/books/:id',viewDetails);
app.get('/error', errorHandler);

// Handlers
function home(request, response) {
  let SQL = 'SELECT * FROM books';

  client.query(SQL)
    .then(results => {
      console.log(results);
      response.status(200).render('pages/index',{'books':results});
    });

}

function newSearch(request, response) {
  response.status(200).render('pages/searches/new');
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
      console.log(returned[4].volumeInfo.categories);
      let arr = returned.map((bookResults) => {
        return new Book(bookResults);
      });
      response.status(200).render('pages/searches/show', { results: arr });
    }).catch(error => {
      console.log(error);
    });
}

function viewDetails(request,response){
  let SQL= 'SELECT * FROM books WHERE id=$1';

  const safeParam=[request.params.id];
  
  client.query(SQL,safeParam)
    .then(results=>{
      response.status(200).render('pages/books/show',{book : results.rows[0]});
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
  this.isbn = obj.volumeInfo.industryIdentifiers ? obj.volumeInfo.industryIdentifiers[0].identifier: 'N/A' ;
  this.bookshelf = obj.volumeInfo.categories ? obj.volumeInfo.categories[0] : 'No Categories';
}


app.listen(PORT, () => {
  console.log(`hi you are on port ${PORT}`);
  console.log(`hello you are connect to database>> ${client.connectionParameters.database}`);
});
