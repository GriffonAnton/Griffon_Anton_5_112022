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
        }).catch(function (err) {
            console.log(err);
        });
}

function displayCartProduct(cartProductFullInfo, cartProduct) {
    totalPrice += cartProductFullInfo.price * cartProduct.quantity;
    totalQuantity += cartProduct.quantity;
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', cartProduct.idProduct);
    article.setAttribute('data-color', cartProduct.color);

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
    pColor.textContent = cartProduct.color;
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
    inputQuantity.addEventListener('change', function () {
        let indexCartProduct = cartArray.findIndex(
            element => element.idProduct == newProduct.idProduct && element.colorSelect == newProduct.colorSelect
        );
        cartArray[indexCartProduct].quantity = Number(this.value);
        updateLocalStorageAndTotals();
    });
    divQuantity.appendChild(pQuantity);
    divQuantity.appendChild(inputQuantity);

    let divDelete = document.createElement('div');
    divContent.classList.add('cart__item__content__settings__delete');
    pDelete = document.createElement('p');
    pDelete.classList.add('deleteItem');
    pDelete.textContent = 'Supprimer';
    pDelete.addEventListener('click', function () {
        let indexCartProduct = cartArray.findIndex(
            element => element.idProduct == newProduct.idProduct && element.colorSelect == newProduct.colorSelect
        );
        cartArray.splice(indexCartProduct, 1);
        updateLocalStorageAndTotals();
        article.remove();
    });

    divSetting.appendChild(divQuantity);
    divSetting.appendChild(divDelete);

    divContent.appendChild(divDescription);
    divContent.appendChild(divSetting);

    article.appendChild(divImg);
    article.appendChild(divContent);

    document.getElementById('cart__items').appendChild(article);
}

function updateLocalStorageAndTotals() {
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cartArray));
    totalQuantity = 0;
    totalPrice = 0;
    prices = document.getElementsByClassName('price');
    inputsQuantity = document.getElementsByClassName('itemQuantity');
    for (let i in prices) {
        totalQuantity += inputQuantity[i];
        totalPrice += inputQuantity[i] * prices[i];
    }
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice;
}

updateLocalStorageAndTotals();

var contact = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    products: null
}

document.getElementById('firstName').addEventListener('change', function () {
    contact.firstName = this.value;
});

document.getElementById('lastName').addEventListener('change', function () {
    contact.lastName = this.value;
});

document.getElementById('adress').addEventListener('change', function () {
    contact.address = this.value;
});

document.getElementById('city').addEventListener('change', function () {
    contact.city = this.value;
});

document.getElementById('email').addEventListener('change', function () {
    contact.email = this.value;
});

document.getElementById('order').addEventListener('click', function () {
    contact.products = cartArray;
    if (firstName == '' || lastName == '' || address == '' || city == '' || email == '') {
        alert('des champs sont vides');
    } else if (!contact.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        alert('email incorrect');
        return;
    } else if (cartArray.length > 0 || cartArray == null) {
        alert('pas de produit dans le panier');
    } else {
        fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
    }
});

