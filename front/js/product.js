var idProduit = new URL(window.location.href).searchParams.get('id');

fetch('http://localhost:3000/api/products/' + idProduit)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (infoProduit) {
        var img = document.createElement('img');
        img.setAttribute('src', infoProduit.imageUrl);
        img.setAttribute('alt', infoProduit.altTxt);
        document.getElementsByClassName('item__img')[0].appendChild(img);

        document.getElementsByTagName('title')[0].textContent = infoProduit.name;
        document.getElementById('title').textContent = infoProduit.name;
        document.getElementById('price').textContent = infoProduit.price;
        document.getElementById('description').textContent = infoProduit.description;

        for (let color of infoProduit.colors) {
            var option = document.createElement('option');
            option.setAttribute('value', color);
            option.textContent = color;
            document.getElementById('colors').appendChild(option);
        }


    }).catch(function (err) {
        console.log(err);
    });

var colorSelect = 0;
var quantite = 0;

document.getElementById('colors').addEventListener('change', function () {
    colorSelect = this.value;
});

document.getElementById('quantity').addEventListener('change', function () {
    quantite = Number(this.value);
    console.log(quantite);
});

document.getElementById('addToCart').addEventListener('click', function () {
    if (quantite > 0 && quantite <= 100 && colorSelect != '') {
        let preQuantite = quantite;
        if (localStorage.getItem(idProduit + ' ' + colorSelect) !== null) {
            let prePanier = JSON.parse(localStorage.getItem(idProduit + ' ' + colorSelect));
            preQuantite += prePanier.quantite;
            localStorage.removeItem(idProduit + ' ' + colorSelect);
        }
        let panier = {
            idProduit: idProduit,
            quantite: preQuantite,
            colorSelect: colorSelect
        }
        let panierJSON = JSON.stringify(panier);
        localStorage.setItem(idProduit + ' ' + colorSelect, panierJSON);
    } else {
        console.log('Erreur. Commande incorrecte.')
    }
});

console.log('fin');