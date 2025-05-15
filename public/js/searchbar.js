"use strict";
let inp_value;
const sofa_arr = [
  "living",
  "livingroom",
  "livingroo",
  "livingro",
  "livingr",
  "livin",
  "livi",
  "liv",
];
const bed_arr = ["bedroom", "beds", "bed", "bedroo", "bedro", "bedr"];
const dining_arr = [
  "diningroom",
  "diningroo",
  "diningro",
  "diningr",
  "dining",
  "dinin",
  "dini",
  "din",
];
const trend = ["trending", "trend", "what's new", "new", "furniture"];
let a = 0;
let b = 0;
let c = 0;
let d = 0;
function check_arr(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b) {
      return 1;
    }
  }
  return 0;
}
document.querySelector(".press").addEventListener("click", function () {
  event.preventDefault();
  inp_value = document.getElementById("input").value;
  inp_value = inp_value.toLowerCase();

  //removing white spaces;
  inp_value = inp_value.replace(/[^a-zA-Z0-9 ]/g, "");
  inp_value = inp_value.replace(/\s+/g, "");
  console.log(inp_value);
  a = check_arr(sofa_arr, inp_value);
  b = check_arr(bed_arr, inp_value);
  c = check_arr(dining_arr, inp_value);
  d = check_arr(trend, inp_value);
  if (a) {
    window.open("living", "_blank");
    a = 0;
    return;
  } else if (b) {
    window.open("bedroom", "_blank");
    b = 0;
    return;
  } else if (c) {
    window.open("dining", "_blank");
    c = 0;
    return;
  } else if (d) {
    window.open("dining", "_blank");
    d = 0;
    return;
  } else {
    document.querySelector(".searchmessage").textContent =
      "RESULT NOT FOUND!!!!!";
  }
});
document.getElementById("input").addEventListener("click", function () {
  document.querySelector(".searchmessage").textContent =
    "ENTER A WORD TO SEARCH OUR PRODUCT";
});
