// Creates and adds kanap information for a given kanap
function createKanapDetail(kanapItem){
    const itemImages = document.getElementsByClassName("item__img");
    if (itemImages.length > 0){
        const newImg = document.createElement("img");
        newImg.setAttribute("src", kanapItem.imageUrl);
        newImg.setAttribute("alt", kanapItem.altTxt);
        itemImages[0].appendChild(newImg);
    }

    const title = document.getElementById("title");
    title.innerHTML = kanapItem.name;
    document.title = kanapItem.name;

    const price = document.getElementById("price");
    price.innerHTML = kanapItem.price;

    const description = document.getElementById("description");
    description.innerHTML = kanapItem.description;

    const colors = document.getElementById("colors");
    for (let color of kanapItem.colors) {
        const optionColor = document.createElement("option");
        optionColor.setAttribute("value", color);
        optionColor.innerHTML = color;
        colors.appendChild(optionColor);
    }
}

// Get kanap id from current URL
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

let id = "";

if(searchParams.has("id")) {
    id = searchParams.get("id");
}

// Fetches the kanap information from the API with the id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (result) {
        if (result.ok) {
            return result.json();
        }
    })
    .then(function (value) {
        createKanapDetail(value);

    })
    .catch(function (error) {
        // An error happenned
        alert("Une erreur inattendue s'est produite, veuillez vous rapprocher de l'administrateur du site");
    });

    // Add the "add to cart" event
    const button = document.getElementById("addToCart");
    button.addEventListener('click', function(event){
        let shoppingCart = localStorage.getItem('shoppingCart');
        if(shoppingCart === null){
            shoppingCart = [];
        }
        else{
            shoppingCart = JSON.parse(shoppingCart);
        }

        const color = document.getElementById("colors").value;
        const quantity = parseInt(document.getElementById("quantity").value);

        // Error managment
        if (color == ""){
            alert("Veulliez saisir une couleur");
            return;
        }
        if (quantity <= 0){
            alert("Veulliez saisir une quantité superieure à zero");
            return;
        }
        if (quantity > 100){
            alert("Veuillez ne pas ajouter plus de 100 articles à la fois");
            return;
        }

        let kanapFound = false;
        for (let kanap of shoppingCart){
            // Check if kanap is already in the shopping cart
            if (kanap.id == id && kanap.color == color){

                if(quantity + kanap.quantity > 100){
                    alert("Veuillez ne pas plus de 100 fois le meme article");
                    return;
                }

                kanap.quantity += quantity;
                kanapFound = true;
                break;
            }
        }
        // If the kanap was not found in the shopping cart we add it
        if (!kanapFound){
            shoppingCart.push({
                id : id, 
                color : color, 
                quantity : quantity
            });
        }

        // Save changes to local storage
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    });