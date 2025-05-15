const menu = document.querySelector(".menu-container");

menu.addEventListener("click", function () {
  document.querySelector(".flyout-menu").style.left = 0;
});
// Close the menu when the #cross is clicked
document.querySelector("#cross").addEventListener("click", function (event) {
  event.stopPropagation(); // Prevent click event from bubbling up to the .menu-container
  document.querySelector(".flyout-menu").style.left = "-200px";
});

const navbar = document.getElementById("navbar");
const ab = document.querySelectorAll(".lo");

window.addEventListener("scroll", function () {
  if (window.scrollY > 1) {
    navbar.style.backgroundColor = "#FFFFFF";
    this.document.querySelector(".menu-trigger").style.color = "black";
    document.getElementById("logoo").src = "/images/logo2.avif";
    document.querySelector("#button-link").style.color = "#D5A07F";
    document.getElementById("button-link").style.borderColor = "#D5A07F";
    for (let i = 0; i < ab.length; i++) {
      ab[i].style.color = "black";
    }
  } else {
    navbar.style.backgroundColor = "";
    this.document.querySelector(".menu-trigger").style.color = "white";
    document.getElementById("logoo").src = "/images/logo1.avif";
    document.querySelector("#button-link").style.color = "white";
    document.getElementById("button-link").style.borderColor = "white";
    for (let i = 0; i < ab.length; i++) {
      ab[i].style.color = "white";
    }
  }
});


