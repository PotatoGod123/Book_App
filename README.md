# Book APP

**Author**: Cristian Robles, Cody Carpenter
**Version**: 1.3.0 <!--(increment the patch/fix version number if you make more commits past your first submission)-->


## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for a Code 301 class. (i.e. What's your problem domain?) -->
This application helps you search up book by either title or author and allows you to save it to a personalies library of your choosing.
## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
Just launch the website to get started!
[https://cr-cc-book-app.herokuapp.com/](https://cr-cc-book-app.herokuapp.com/);
## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
Languages: SQL, Javascript, HTML, CSS,EJS
Libraries: EJS, Express, superagent, postgress, CORS, dotenv
Application: Heroku

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with GET and POST routes for the book resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

1/26/2021 01:20am VER: 1.3.0- Updated some more css and got rid of the old ugly one, Also added extra feature with the user now being able to update the details of any of there saved books and outright delete from their bookshelf. Also added a hamburger nav working with only css and html.

1/22/2021 12:30am VER: 1.2.0- Rehauled visuals of css in mobile view. Added a databse and functionality of web app to now be able to save books from your search results be added to your bookself on the homepage. From there you are able to see the details of said book. All done with an SQL databse. 

1/16/2021 10:10pm VER: 1.1.0- Added new routes that will render to the web browser all from server side, Using ejs files with pre typed HTML. When a user goes to search, they will be given a form to fill out then be redirected to another route with their data gotten from search query put inside an API call and tailored to be displayed on the ejs file.


1/16/2021 8:40pm VER: 1.0.0- Inital set up of repository directory and all neccasery files that will be needed.