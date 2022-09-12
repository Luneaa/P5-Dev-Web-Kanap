fetch("http://localhost:3000/api/products/" + id)
    .then(function (result) {
        if (result.ok) {
            return result.json();
        }
    })
    .then(function (value) {


    })
    .catch(function (error) {
        // Une erreur est survenue
    });