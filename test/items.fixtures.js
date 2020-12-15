function makeItemsArray() {
    return [
        {
            "id": 1,
            "userid": 1,
            "title": 'Maroon Shirt',
            "image": 'https://res.cloudinary.com/francescalitterio/image/upload/v1607381580/maroon-shirt_knqzwj.jpg',
            "season": 'fall',
            "category": 'tops, t-shirts',
            "favorite": true,
          },
          {
            "id": 2,
            "userid": 1,
            "title": 'Boyfriend Jeans',
            "image": 'https://res.cloudinary.com/francescalitterio/image/upload/v1607477171/boyfriend-jeans_ijlxo8.jpg',
            "season": 'fall, spring',
            "category": 'pants, jeans',
            "favorite": true,
          },
          {
            "id": 3,
            "userid": 1,
            "title": 'Gray Beanie',
            "image": ' ',
            "season": 'winter',
            "category": 'accessories, hats',
            "favorite": false,
          },
    ];
}

function makeMaliciousItem() {
    const maliciousItem = {
        id: 911,
        userid: 1,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }

    const expectedItem = {
        ...maliciousItem,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousItem,
        expectedItem,
    }
}

module.exports = {
    makeItemsArray,
    makeMaliciousItem,
}