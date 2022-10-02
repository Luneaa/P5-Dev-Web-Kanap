// Get order id from current URL
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

let orderId = "";

if(searchParams.has("orderId")) {
    orderId = searchParams.get("orderId");
}

const orderElement = document.getElementById("orderId");
    orderElement.innerHTML = orderId;