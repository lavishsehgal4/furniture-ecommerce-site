// upside button
function scrollToSection() {
  // Scroll to the section with id="target-section" without using the URL hash
  document
    .getElementById("background_img")
    .scrollIntoView({ behavior: "smooth" });
}

let isScrolling;
const upbutton = document.querySelector(".arrow-button");
// Event listener for scroll
window.addEventListener("scroll", function () {
  upbutton.classList.remove("hiddee");
  // Clear the timeout if scrolling is continuing
  window.clearTimeout(isScrolling);

  // Set a timeout to run after scrolling stops (e.g., 200ms)
  isScrolling = setTimeout(function () {
    upbutton.classList.add("hiddee"); // This will be triggered after the scroll ends
  }, 2000);
});

//help form
function toggleHelpForm() {
  var helpForm = document.getElementById("helpForm");
  helpForm.classList.toggle("open");
}

//responsiveness for very small width
