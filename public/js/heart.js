// Get the heart button element
const heartBtn = document.getElementById("heart-btn");
const a = document.querySelector(".heart-icon");
// Add click event listener to the heart button
heartBtn.addEventListener("click", () => {
  // Toggle 'active' class to change heart appearance
  heartBtn.classList.toggle("active");

  // Simulate adding/removing product to/from the cart
  if (heartBtn.classList.contains("active")) {
    console.log("Product added to cart");
  } else {
    console.log("Product removed from cart");
  }
});
