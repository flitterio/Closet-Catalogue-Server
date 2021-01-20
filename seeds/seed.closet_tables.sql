INSERT INTO cc_users (id, fname, lname, username, email, password)
VALUES
        ( 1, 'Example', 'User', 'exampleuser', 'exampleuser@example.com', '$2a$12$.2zQKu4H2bk0JKQe22XDwOmTzazpFjvlnY8.KlaUVUxVmdlLmfAuW'),
        (123, 'Francesca','Litterio', 'flitterio', 'francesca@litterio.net', '$2a$12$NuG4ocezpveexIHaLGcrMuIs3ZdvACIfBlsMI5wpc0PI7zWlS6l1q');

INSERT INTO cc_items (id, userid, title, image, season, category, favorite)
    VALUES
    (1, 1,'Maroon Shirt', 'https://res.cloudinary.com/francescalitterio/image/upload/v1607381580/maroon-shirt_knqzwj.jpg','Fall','Tops', true),
    (2, 1, 'Boyfriend Jeans','https://res.cloudinary.com/francescalitterio/image/upload/v1607477171/boyfriend-jeans_ijlxo8.jpg', 'Fall, Spring', 'Bottoms', true ),
    (3, 1, 'Gray Beanie', 'http://res.cloudinary.com/francescalitterio/image/upload/v1609120297/wkk4acee2wtss4qfzigt.jpg', 'Winter','Accessories', false ),
    (4, 123, 'Colorful Romper', 'https://res.cloudinary.com/francescalitterio/image/upload/v1607481196/colorful-romper.jpg', 'Summer', 'romper', true ),
    (5, 123, 'Black Rose String Bikini', 'https://res.cloudinary.com/francescalitterio/image/upload/v1608750471/black-rose-bikini.jpg', 'summer', 'swimwear', false),
    (6, 1, 'Tan Pants', ' ', ' ', 'pants, dresspants', true ),
    (7, 1, 'Cat Ears', 'https://res.cloudinary.com/francescalitterio/image/upload/v1608750754/white-flower-cat-ear.jpg', ' ', 'Accessories', true );