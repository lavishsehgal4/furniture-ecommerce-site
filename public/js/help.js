document.getElementById("helpForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    postcode: formData.get("postcode"),
    message: formData.get("message"),
    agreedToTerms: formData.get("agree") === "on",
  };

  try {
    const res = await fetch("/help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    alert(text);
    if (res.ok) e.target.reset();
  } catch (err) {
    alert("Failed to submit help request. Try again later.");
  }
});
