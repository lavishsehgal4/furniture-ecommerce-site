function addToCart(product) {
  fetch("/add-to-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in to add items to your cart.");
        }
        throw new Error("An error occurred while adding to cart.");
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message); // Show popup on success
    })
    .catch((err) => {
      alert(err.message); // Show popup on error
    });
}
