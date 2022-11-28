fetch('http://localhost:3000/api/products')
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (listeProducts) {
        for (let product of listeProducts) {
            displayProduct(product);
        }
    }).catch(function (err) {
        console.log(err);
    });

function displayProduct(product) {
    var link = document.createElement('a');
    link.setAttribute('href', './product.html?id=' + product._id);

    var article = document.createElement('article');

    var img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);

    var h3 = document.createElement('h3');
    h3.classList.add('productName');
    h3.textContent = product.name;

    var p = document.createElement('p');
    p.classList.add('productDescription');
    p.textContent = product.description;

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    link.appendChild(article);
    document.getElementById('items').appendChild(link);
}