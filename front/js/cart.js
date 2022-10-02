// Creates a HTML kanap node and return it
function createKanapCart(kanapItem, cartItem) {
    let stringItem = 
    `<article class="cart__item" data-id="${kanapItem.id}" data-color="${cartItem.color}">
    <div class="cart__item__img">
      <img src="${kanapItem.imageUrl}" alt="${kanapItem.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${kanapItem.name}</h2>
        <p>${cartItem.color}</p>
        <p>${kanapItem.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;

  let container = document.createElement("div");
  container.innerHTML = stringItem;

  return container.firstChild;
}

// Fetches kanap information for a given id and return a promise (async)
function getKanapInfo(id) {

    return fetch("http://localhost:3000/api/products/" + id)
    .then(function (result) {
        if (result.ok) {
            return result.json();
        }
    })
    .catch(function (error) {
        // An error happenned
        alert("Une erreur inattendue s'est produite, veuillez vous rapprocher de l'administrateur du site");
    });
}

// Generate kanaps and related events on the document
// This is an async function to avoid blocking the application and load asynchronously the data from the API
async function generateKanaps(){
  // Get shopping cart from localStorage
  let shoppingCart = localStorage.getItem('shoppingCart');
  if(shoppingCart === null){
      shoppingCart = [];
  }
  else{
      shoppingCart = JSON.parse(shoppingCart);
  }
  
  const itemSection = document.getElementById("cart__items");
  let totalQuantity = 0;
  let totalPrice = 0;
  let prices = [];
  
  // Fetch kanap infos and calculate price and quantity
  for(let kanap of shoppingCart) {
      await getKanapInfo(kanap.id)
      .then(function(result){
          let kanapItem = createKanapCart(result, kanap);
          itemSection.appendChild(kanapItem);
  
          totalQuantity += kanap.quantity;
          totalPrice += result.price * kanap.quantity;
          prices.push(result.price);
      });
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  // Add delete event for kanaps
  const buttons = document.getElementsByClassName('deleteItem');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(event) {
      shoppingCart.splice(i, 1);
      localStorage.setItem('shoppingCart' ,JSON.stringify(shoppingCart));
      itemSection.innerHTML = '';
      generateKanaps();
    });
  }

  // Manage quantity changes on kanaps
  const inputs = document.getElementsByClassName('itemQuantity');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('change', function(event){
      if (event.target.value <= 0){
        alert("Veulliez saisir une quantité superieure à zero");
        inputs[i].value = shoppingCart[i].quantity;
      }
      else if (event.target.value > 100){
        alert("Veuillez ne pas dépasser les 100 articles du meme produit");
        inputs[i].value = shoppingCart[i].quantity;
      }
      else {
        shoppingCart[i].quantity = parseInt(event.target.value);
        localStorage.setItem('shoppingCart' ,JSON.stringify(shoppingCart));
        totalQuantity = 0;
        totalPrice = 0;

        for(let i = 0; i < shoppingCart.length; i++){
          totalQuantity += shoppingCart[i].quantity;
          totalPrice += prices[i] * shoppingCart[i].quantity;
        }
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
        document.getElementById("totalPrice").innerHTML = totalPrice;

      }
    });
  }
}

function initializeForm() {
  let confirmButton = document.getElementById("order");
  confirmButton.addEventListener("click", async function(e) {
    e.preventDefault();
    let contact = validateForm();
    if (contact != null) {
      // Send contact and shopping cart to the API
      let shoppingCart = localStorage.getItem('shoppingCart');
      if(shoppingCart === null){
          shoppingCart = [];
      }
      else{
          shoppingCart = JSON.parse(shoppingCart);
      }
      if(shoppingCart.length == 0){
        alert("Il n'y a aucun article dans le panier, commande impossible");
        return;
      }
      let productIds = shoppingCart.map(p => p.id);
      let request = { contact : contact, products : productIds};

      // Send POST request
      let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      let responseItem = await response.json();

      window.location.replace("./confirmation.html?orderId=" + responseItem.orderId);
    }
  });
}

// Validate the form and returns the contact information if valid, returns null if invalid
function validateForm(){
  let result = {};
  let valid = true;

  document.getElementById("firstNameErrorMsg").innerHTML = "";
  document.getElementById("lastNameErrorMsg").innerHTML = "";
  document.getElementById("addressErrorMsg").innerHTML = "";
  document.getElementById("cityErrorMsg").innerHTML = "";
  document.getElementById("emailErrorMsg").innerHTML = "";

  result.firstName = document.getElementById("firstName").value;
  result.lastName = document.getElementById("lastName").value;
  result.address = document.getElementById("address").value;
  result.city = document.getElementById("city").value;
  result.email = document.getElementById("email").value;

  if (result.firstName == ""){
    document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez saisir votre prénom";
    valid = false;
  }
  if (result.lastName ==""){
    document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez saisir votre nom";
    valid = false;
  }
  if (result.address ==""){
    document.getElementById("addressErrorMsg").innerHTML = "Veuillez saisir votre adresse";
    valid = false;
  }
  if (result.city ==""){
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez saisir votre ville";
    valid = false;
  }
  if (result.email ==""){
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez saisir votre email";
    valid = false;
  }
  else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(result.email)){
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez saisir un email valide";
    valid = false;
  }

  return valid ? result : null;
}

generateKanaps();
initializeForm();
