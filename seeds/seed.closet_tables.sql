INSERT INTO cc_users (id, fname, lname, username, email, password)
VALUES
        ( 1, 'Example', 'User', 'exampleuser', 'exampleuser@example.com', '$2a$12$.2zQKu4H2bk0JKQe22XDwOmTzazpFjvlnY8.KlaUVUxVmdlLmfAuW'),
        (123, 'Francesca','Litterio', 'flitterio', 'francesca@litterio.net', '$2a$12$NuG4ocezpveexIHaLGcrMuIs3ZdvACIfBlsMI5wpc0PI7zWlS6l1q');

INSERT INTO cc_items (id, userid, title, image, season, category, favorite)
    VALUES
    (1, 1,'Maroon Shirt', 'https://res.cloudinary.com/francescalitterio/image/upload/v1607381580/maroon-shirt_knqzwj.jpg','fall','tops, t-shirts', true),
    (2, 1, 'Boyfriend Jeans','https://res.cloudinary.com/francescalitterio/image/upload/v1607477171/boyfriend-jeans_ijlxo8.jpg', 'fall, spring', 'pants, jeans', true ),
    (3, 1, 'Gray Beanie', ' ', 'winter','accessories, hats', false );