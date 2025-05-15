async function handleSubmit(event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const response = await fetch("/saveUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  alert(result.message); // Show success message
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  window.location.replace("/login");
}
