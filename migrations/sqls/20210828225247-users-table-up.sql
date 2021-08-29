CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    lastname VARCHAR(100),
    passwordDigest VARCHAR
);