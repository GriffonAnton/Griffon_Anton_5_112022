var cartArray = JSON.parse(localStorage.getItem('cart'));
var totalPrice = 0;
var totalQuantity = 0;

for (let cartProduct of cartArray) {
    fetch('http://localhost:3000/api/products/' + cartProduct.idProduct)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        }).then(function (cartProductFullInfo) {
            displayCartProduct(cartProductFullInfo, cartProduct);
            updateTotals();
        }).catch(function (err) {
            console.log(err);
        });
}

function displayCartProduct(cartProductFullInfo, cartProduct) { //affiche les informations d'un produit avec les informations passées en paramètre
    totalPrice += cartProductFullInfo.price * cartProduct.quantity;
    totalQuantity += cartProduct.quantity;

    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', cartProduct.idProduct);
    article.setAttribute('data-color', cartProduct.colorSelect);

    let divImg = document.createElement('div');
    divImg.classList.add('cart__item__img');
    let img = document.createElement('img');
    img.setAttribute('src', cartProductFullInfo.imageUrl);
    img.setAttribute('alt', cartProductFullInfo.altTxt);
    divImg.appendChild(img);
    article.appendChild(divImg);

    let divContent = document.createElement('div');
    divContent.classList.add('cart__item__content');

    let divDescription = document.createElement('div');
    divContent.classList.add('cart__item__content__description');
    let h2 = document.createElement('h2');
    h2.textContent = cartProductFullInfo.name;
    let pColor = document.createElement('p');
    pColor.textContent = cartProduct.colorSelect;
    let pPrice = document.createElement('p');
    pPrice.classList.add('price');
    pPrice.setAttribute('data-price', cartProductFullInfo.price);
    pPrice.textContent = cartProductFullInfo.price + ' €';
    divDescription.appendChild(h2);
    divDescription.appendChild(pColor);
    divDescription.appendChild(pPrice);

    let divSetting = document.createElement('div');
    divContent.classList.add('cart__item__content__settings');

    let divQuantity = document.createElement('div');
    divContent.classList.add('cart__item__content__settings__quantity');
    let pQuantity = document.createElement('p');
    pQuantity.textContent = 'Qté :';
    let inputQuantity = document.createElement('INPUT');
    inputQuantity.setAttribute('type', 'number');
    inputQuantity.classList.add('itemQuantity');
    inputQuantity.setAttribute('name', 'itemQuantity');
    inputQuantity.setAttribute('min', '1');
    inputQuantity.setAttribute('max', '100');
    inputQuantity.setAttribute('value', cartProduct.quantity);
    inputQuantity.addEventListener('change', function (event) {
        let indexCartProduct = cartArray.findIndex(
            element => element.idProduct == event.target.closest('article').dataset.id && element.colorSelect == event.target.closest('article').dataset.color
        );
        console.log('indexCartProduct : ' + indexCartProduct);
        cartArray[indexCartProduct].quantity = Number(this.value);
        localStorage.setItem('cart', JSON.stringify(cartArray));
        updateTotals();
    });
    divQuantity.appendChild(pQuantity);
    divQuantity.appendChild(inputQuantity);

    let divDelete = document.createElement('div');
    divContent.classList.add('cart__item__content__settings__delete');
    pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Supprimer';
    pDelete.addEventListener('click', function (event) {
        let indexCartProduct = cartArray.findIndex(
            element => element.idProduct == event.target.closest('article').dataset.id && element.colorSelect == event.target.closest('article').dataset.color
        );
        console.log('indexCartProduct : ' + indexCartProduct);
        cartArray.splice(indexCartProduct, 1);
        localStorage.setItem('cart', JSON.stringify(cartArray));
        article.remove();
        updateTotals();
    });
    divDelete.appendChild(pDelete);

    divSetting.appendChild(divQuantity);
    divSetting.appendChild(divDelete);

    divContent.appendChild(divDescription);
    divContent.appendChild(divSetting);

    article.appendChild(divImg);
    article.appendChild(divContent);

    document.getElementById('cart__items').appendChild(article);
}

function updateTotals() { //récupère les prix et quantités des articles, recalcule le prix et la quantité totale et met à jour leur affichage

    totalQuantity = 0;
    totalPrice = 0;
    prices = document.getElementsByClassName('price');
    console.log('prices : ');
    console.log(prices);
    inputsQuantity = document.getElementsByClassName('itemQuantity');
    console.log('inputsQuantity : ');
    console.log(inputsQuantity);
    for (let i in prices) {
        if (!isNaN(i)) {
            console.log('update total turn : ' + i);
            console.log(totalPrice);
            console.log(totalQuantity);
            console.log(inputsQuantity[i]);
            totalQuantity += Number(inputsQuantity[i].value);
            totalPrice += Number(inputsQuantity[i].value) * Number(prices[i].dataset.price);
        }
    }
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice;
}

var contact = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: ''
}

document.getElementById('firstName').addEventListener('input', function () {
    contact.firstName = this.value;
});

document.getElementById('lastName').addEventListener('input', function () {
    contact.lastName = this.value;
});

document.getElementById('address').addEventListener('input', function () {
    contact.address = this.value;
});

document.getElementById('city').addEventListener('input', function () {
    contact.city = this.value;
});

document.getElementById('email').addEventListener('input', function () {
    contact.email = this.value;
});

for (champ of Object.keys(contact)) {
    console.log('nom du champ: ', champ);
}


document.getElementById('order').addEventListener('click', function (e) { //vérifie les informations du formulaire et affiche les éventuels messages d'erreur. Si tout est correct, envoie le formulaire à l'API et redirige à la page de confirmation avec le numéro de commande retourné en réponse
    e.preventDefault();
    let inputIsOk = true;
    for (champ of Object.keys(contact)) {
        console.log('nom du champ: ', champ);
        document.getElementById(champ + 'ErrorMsg').textContent = '';
    }
    if (!contact.firstName.match(/^([A-Z]|[a-z]|[À-ÿ]|\-)+$/)) {
        document.getElementById('firstNameErrorMsg').textContent = 'Ce champ n\'est pas valide. Ne peut contenir que des lettres ou des - .';
        inputIsOk = false;
    }
    if (!contact.lastName.match(/^([A-Z]|[a-z]|[À-ÿ]|\-|\'|\s)+$/)) {
        document.getElementById('lastNameErrorMsg').textContent = 'Ce champ n\'est pas valide. Ne peut contenir que des lettres, - ,  \' , ou espaces.';
        inputIsOk = false;
    }
    if (!contact.address.match(/^([A-Z]|[a-z]|[À-ÿ]|[0-9]|\s|\-|\')+$/)) {
        document.getElementById('addressErrorMsg').textContent = 'Ce champ n\'est pas valide. Ne peut contenir que des lettres, chiffres, - ,  \' , ou espaces.';
        inputIsOk = false;
    }
    if (!contact.city.match(/^([A-Z]|[a-z]|\-|\')+$/)) {
        document.getElementById('cityErrorMsg').textContent = 'Ce champ n\'est pas valide. Ne peut contenir que des lettres, - ou \' .';
        inputIsOk = false;
    }
    if (!contact.email.match(/^([a-z]|[0-9]|\_|\-|\.)+@{1}([a-z]|[0-9]|\_|\-|\.)+\.[a-z]{2,10}$/)) {
        document.getElementById('emailErrorMsg').textContent = 'Ce champ n\'est pas valide. Doit être rempli au format suivant: example-nom.prénom@example_domaine-09.com';
        inputIsOk = false;
    }
    for (champ of Object.keys(contact)) {
        if (contact[champ] == '') {
            document.getElementById(champ + 'ErrorMsg').textContent = 'Ce champ est vide';
            inputIsOk = false;
        }
    }
    if (cartArray.length == 0 || cartArray == null) {
        alert('pas de produit dans le panier');
        inputIsOk = false;
    }
    if (!inputIsOk) {
        return;
    }
    console.log({
        'contact': JSON.stringify(contact),
        'products': function () {
            let products = new Array();
            for (cartItem in cartArray) {
                products.add(cartItem.idProduct);
            }
            return JSON.stringify(products);
        }
    });
    let products = new Array();
    for (cartItem of cartArray) {
        console.log('add in products', cartItem, cartItem.idProduct, products);
        products.push(cartItem.idProduct);
    }
    let request = {
        contact: contact,
        products: products
    };
    console.log('request', request, JSON.stringify(request));

    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)

    }).then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (value) {
        window.location.href = "http://localhost:5500/front/html/confirmation.html?orderId=" + value.orderId;
    }).catch(function (err) {
        console.log(err);
    });
});
/*
* {
* contact: {
 * firstName: string,
 * lastName: string,
 * address: string,
 * city: string,
 * email: string
* }
 * products: [string] < --array of product _id
 * }
    */