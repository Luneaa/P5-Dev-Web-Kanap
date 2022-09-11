// Creation d'un nouvel element HTML kanap
function createKanap(kanapItem) {
    const newElement = document.createElement("a");
    newElement.setAttribute("href", "./product.html?id=" + kanapItem._id);
    const newArticle = document.createElement("article");
    const newImg = document.createElement("img");
    newImg.setAttribute("src", kanapItem.imageUrl);
    newImg.setAttribute("alt", kanapItem.altTxt);
    const newTitle = document.createElement("h3");
    newTitle.classList.add("productName");
    newTitle.innerHTML = kanapItem.name;
    const newP = document.createElement("p");
    newP.classList.add("productDescription");
    newP.innerHTML = kanapItem.description;

    // Mise en arborescence
    newArticle.appendChild(newImg);
    newArticle.appendChild(newTitle);
    newArticle.appendChild(newP);
    newElement.appendChild(newArticle);

    return newElement;
}

fetch(" http://localhost:3000/api/products/")
    .then(function (result) {
        if (result.ok) {
            return result.json();
        }
    })
    .then(function (value) {
        let items = document.getElementById("items");
        for (let kanapItem of value) {
            let aKanap = createKanap(kanapItem);
            items.appendChild(aKanap);
        }
    })
    .catch(function (error) {
        // Une erreur est survenue
    });