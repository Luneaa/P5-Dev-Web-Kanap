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

const url = new URL(window.location.href);

const searchParams = new URLSearchParams(url.search);

let id = "";

if(searchParams.has("id")) {
    id = searchParams.get("id");
}

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
        // Une erreur est survenue
    });


    const button = document.getElementById("addToCart");
    button.addEventListener('click', function(event){
        let shoppingCart = localStorage.getItem('shoppingCart');
        if(shoppingCart === null){
            shoppingCart = [];
        }
        else{
            shoppingCart = JSON.parse(shoppingCart);
        }
        const title = document.getElementById("title").innerHTML;
        const color = document.getElementById("colors").value;
        const quantity = parseInt(document.getElementById("quantity").value);

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
            if (kanap.title == title && kanap.color == color){
                kanap.quantity += quantity;
                kanapFound = true;
                break;
            }
        }
        if (!kanapFound){
            shoppingCart.push({
                title : title, 
                color : color, 
                quantity : quantity
            });
        }
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    });