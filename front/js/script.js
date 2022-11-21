fetch('http://localhost:3000/api/products')
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (listeProduits) {
        for (let produit of listeProduits) {
            var lien = document.createElement('a');
            lien.setAttribute('href', './product.html?id=' + produit._id);

            var article = document.createElement('article');

            var img = document.createElement('img');
            img.setAttribute('src', produit.imageUrl);
            img.setAttribute('alt', produit.altTxt);

            var h3 = document.createElement('h3');
            h3.classList.add('productName');
            h3.textContent = produit.name;

            var p = document.createElement('p');
            p.classList.add('productDescription');
            p.textContent = produit.description;

            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
            lien.appendChild(article);
            document.getElementById('items').appendChild(lien);

        }
    }).catch(function (err) {
        console.log(err);
    });