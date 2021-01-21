DROP TABLE IF EXISTS books;


CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    isbn VARCHAR(255),
    image VARCHAR(300),
    bookshelf VARCHAR(255)
);