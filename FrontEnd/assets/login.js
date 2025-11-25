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

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.token) {
            localStorage.setItem("authToken", result.token);
            window.location.href = "index.html";
        } else {
            throw new Error("Le token est manquant dans la réponse du serveur");
        };

      } else {
        displayError();
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Impossible de contacter le serveur. Veuillez vérifier votre connexion ou réessayer plus tard.");
    }
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