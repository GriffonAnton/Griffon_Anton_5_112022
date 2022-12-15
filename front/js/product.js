var idProduct = new URL(window.location.href).searchParams.get('id');

fetch('http://localhost:3000/api/products/' + idProduct)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (infoProduct) {
        displayProduct(infoProduct);
    }).catch(function (err) {
        console.log(err);
        alert("produit inexistant. retour à l'accueil");
        window.location.href = "http://localhost:5500/front/html";
    });

var colorSelect = 0;
var quantity = 0;

document.getElementById('colors').addEventListener('change', function () {
    colorSelect = this.value;
});

document.getElementById('quantity').addEventListener('change', function () {
    quantity = Number(this.value);
    console.log(quantity);
});

document.getElementById('addToCart').addEventListener('click', function () {
    cartAddition();
});

function displayProduct(infoProduct) { // insère les informations passées en paramètre du produit dans la page
    let img = document.createElement('img');
    img.setAttribute('src', infoProduct.imageUrl);
    img.setAttribute('alt', infoProduct.altTxt);
    document.getElementsByClassName('item__img')[0].appendChild(img);

    document.getElementsByTagName('title')[0].textContent = infoProduct.name;
    document.getElementById('title').textContent = infoProduct.name;
    document.getElementById('price').textContent = infoProduct.price;
    document.getElementById('description').textContent = infoProduct.description;

    for (let color of infoProduct.colors) {
        let option = document.createElement('option');
        option.setAttribute('value', color);
        option.textContent = color;
        document.getElementById('colors').appendChild(option);
        console.log('couleur ajoutée : ' + color);
    }
}

function cartAddition() { // ajoute dans le localStorage le produit avec son ID, sa couleur et sa quantité, et augmente seulment la quantité si il y est déjà
    if (!(quantity > 0 && quantity <= 100 && colorSelect != '')) {
        alert('Erreur. Commande incorrecte. Quantité non comprise entre 0 et 100 et couleur non choisie');
        return;
    }
    var cart = localStorage.getItem('cart');
    var newProduct = {
        idProduct: idProduct,
        quantity: quantity,
        colorSelect: colorSelect
    };
    if (cart === null) {
        let cartList = new Array();
        cartList.push(newProduct);
        localStorage.setItem('cart', JSON.stringify(cartList));
    } else {
        console.log('panier existant');
        let cartListArray = JSON.parse(cart);
        let existingProduct = cartListArray.find(
            element => element.idProduct == newProduct.idProduct && element.colorSelect == newProduct.colorSelect
        );
        console.log(existingProduct);
        console.log(newProduct);
        if (existingProduct != null) {
            console.log('existant');
            existingProduct.quantity += newProduct.quantity;
        } else {
            console.log('nouveau');
            cartListArray.push(newProduct);
        }
        console.log(cartListArray);
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(cartListArray));
    }
    alert("produit ajouté");
}

console.log('fin');