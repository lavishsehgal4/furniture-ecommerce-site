"use strict";
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const get_modal = document.getElementById("navbar");
const fiftyPercentOfPage = document.documentElement.scrollHeight * 0.5;
let count = 1;
window.addEventListener("scroll", function () {
  // Get the scroll position of the window
  const scrollPosition = window.scrollY;
  if (count === 1 && scrollPosition > fiftyPercentOfPage) {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    count++;
  }
});

const closemodal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnCloseModal.addEventListener("click", closemodal);
overlay.addEventListener("click", closemodal);

document.addEventListener("keydown", function (k) {
  if (k.key === "Escape" && !modal.classList.contains("hidden")) {
    closemodal();
  }
});

async function subscribeEmail() {
  const email = document.getElementById("emailInput").value.trim();

  if (!email) {
    alert("Please enter a valid email.");
    return;
  }

  try {
    const response = await fetch("/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.text(); // or use .json() if returning JSON
    alert(result);
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again later.");
  }
  closemodal();
}
