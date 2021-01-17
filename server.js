'use strict';
// bring in dependecies
require('dotenv').config();
const express=require('express');
const cors = require('cors');
const superagent= require('superagent');
const PORT = process.env.PORT || 3000;


const app = express();

app.use(cors());
//this will set express to use ejs as its rendger engine
app.set('view engine','ejs');
//this will tell express to always send the public directory
app.use(express.static('./public'));

// this will allow us to get access to the encoded data inside POST routes
app.use(express.urlencoded({extended:true}));











app.listen(PORT,()=>{
  console.log(`hi you are on port ${PORT}`);
});

