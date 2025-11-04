/* LOG IN FORMS*/

const logInForms = document.querySelector(".logInForms");

function logAdmin() {

  logInForms.addEventListener("submit", async (event) => {

    event.preventDefault();

    const emailInform = event.target.querySelector("[name=usermail]").value;
    const passwordInform = event.target.querySelector("[name=password]").value;
    const userData = {
      email: emailInform,
      password: passwordInform,
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("authToken", result.token);
      window.location.href = "index.html";
    } else {
      displayError();
    };
  });
};

function displayError() {

  let errorMessage = document.querySelector(".error-message")

  if (!errorMessage) {
    errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    logInForms.appendChild(errorMessage);
  }

  errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
};

logAdmin();