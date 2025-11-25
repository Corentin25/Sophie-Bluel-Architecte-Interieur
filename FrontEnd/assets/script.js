/* DATA RETRIEVAL AND RUN */

let dataWorks = [];

async function run() {

  try {
    const works = await fetch("http://localhost:5678/api/works");
    
    if (!works.ok) {
      throw new Error(`Erreur HTTP ! statut : ${works.status}`);
    };

    dataWorks = await works.json();
    console.log("All works : ", dataWorks);

    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Vous êtes en mode administrateur");
      activAdminMood();
    };

    genererWorks();
    activeFilters();

  } catch (error) {
    console.error("Impossible de charger les projets :", error);
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = "<p>Une erreur est survenue lors du chargement des projets. Veuillez réessayer plus tard.</p>";
  };
};

/* GENERATE ALL WORKS */

const sectionGallery = document.querySelector(".gallery");

function genererWorks(arrayWorks = dataWorks) {

  sectionGallery.innerHTML = "";
  for (let i = 0; i < arrayWorks.length; i++) {

    const article = document.createElement("article");
    sectionGallery.appendChild(article);

    const imgProject = document.createElement("img");
    imgProject.src = arrayWorks[i].imageUrl;
    imgProject.alt = arrayWorks[i].title;
    article.appendChild(imgProject);

    const titleProject = document.createElement("h3");
    titleProject.classList.add("titleProject");
    titleProject.innerText = arrayWorks[i].title;
    article.appendChild(titleProject);
  }
}

/* FILTERS */

const filters = document.querySelector(".filters");

function activeFilters() {

  const CATEGORY_OBJECTS = 1;
  const CATEGORY_APARTMENTS = 2;
  const CATEGORY_HOTELS = 3;

  const withoutFilter = document.createElement("button");
  withoutFilter.textContent = "Tous";
  filters.appendChild(withoutFilter);
  withoutFilter.addEventListener("click", () => {
    genererWorks();
    activeButton(withoutFilter);
  });

  const objectFilter = document.createElement("button");
  objectFilter.textContent = "Objets";
  filters.appendChild(objectFilter);
  objectFilter.addEventListener("click", () => {
    const filtered = dataWorks.filter((work) => work.categoryId === CATEGORY_OBJECTS);
    genererWorks(filtered);
    activeButton(objectFilter);
    console.log("Objects : ", filtered);
  });

  const appartmentsFilter = document.createElement("button");
  appartmentsFilter.textContent = "Appartements";
  filters.appendChild(appartmentsFilter);
  appartmentsFilter.addEventListener("click", () => {
    const filtered = dataWorks.filter((work) => work.categoryId === CATEGORY_APARTMENTS);
    genererWorks(filtered);
    activeButton(appartmentsFilter);
    console.log("Appartments : ", filtered);
  });

  const hotelsFilter = document.createElement("button");
  hotelsFilter.textContent = "Hôtels & Restaurants";
  filters.appendChild(hotelsFilter);
  hotelsFilter.addEventListener("click", () => {
    const filtered = dataWorks.filter((work) => work.categoryId === CATEGORY_HOTELS);
    genererWorks(filtered);
    activeButton(hotelsFilter);
    console.log("Hotels & Restaurants : ", filtered);
  });

  const allbuttons = [withoutFilter, objectFilter, appartmentsFilter, hotelsFilter];
  function activeButton(newButton) {
    allbuttons.forEach((previousButton) => previousButton.classList.remove("active"));
    newButton.classList.add("active");
  };

  activeButton(withoutFilter);
};

/* ADMIN MOOD */

const logOut = document.querySelector(".logInOut");
const editionMarker = document.querySelector(".editionMood");
const header = document.querySelector("header");
const editProjects = document.getElementById("editProjects");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const topModal = document.querySelector(".topModal");
const closeModal = document.querySelector(".fa-xmark");
const backModal = document.querySelector(".fa-arrow-left");
const modalH3 = document.querySelector(".modal h3");
const removeProjects = document.querySelector(".removeProjects");
const newProjetcForms = document.querySelector(".newProjetcForms");
const addPhoto = document.querySelector(".addPhoto");
const upLineAdd = document.querySelector(".upLineAdd");
const addProject = document.querySelector(".addProject");
const validProject = document.querySelector(".validProject");

function activAdminMood() {

  logOut.textContent = "logout";
  logOut.removeAttribute("href");
  logOut.style.cursor = "pointer";
  logOut.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  });

  editionMarker.style.display = "flex";
  header.style.marginTop = "5.5em";
  filters.style.display = "none";
  editProjects.style.display = "flex";

  /* Generate edit modal */

  editProjects.addEventListener("click", () => {
    overlay.style.display = "flex";
    modalEditProject();
  });

  function modalEditProject() {
    topModal.style.justifyContent = "flex-end";
    backModal.style.display = "none";
    modalH3.textContent = "Galerie photo";
    removeProjects.style.display = "grid";
    newProjetcForms.style.display = "none";
    upLineAdd.style.display = "flex";
    addProject.style.display = "flex";
  };

  /* Generate new project modal */

  addProject.addEventListener("click", () => {
    modalAddProject();
  });

  function modalAddProject() {
    document.getElementById("title").addEventListener("input", validButtonOk);
    document.getElementById("category").addEventListener("change", validButtonOk);
    document.getElementById("addPhotoInput").addEventListener("change", validButtonOk);
    topModal.style.justifyContent = "space-between";
    backModal.style.display = "block";
    modalH3.textContent = "Ajout photo";
    newProjetcForms.style.display = "flex"
    removeProjects.style.display = "none";
    upLineAdd.style.display = "none";
    addProject.style.display = "none";
    imagePreview();
  };

  /* Switch or close modals */

  backModal.addEventListener("click", () => {
    const errorMessage = document.querySelector(".errorValidMsg");
    if (errorMessage) {
      errorMessage.remove();
    };
    modalEditProject();
    resetAddForm();
  });

  closeModal.addEventListener("click", () => {
    overlay.style.display = "none";
    const errorMessage = document.querySelector(".errorValidMsg");
    if (errorMessage) {
      errorMessage.remove();
    };
    resetAddForm();
  });

  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    const errorMessage = document.querySelector(".errorValidMsg");
    if (errorMessage) {
      errorMessage.remove();
    };
    resetAddForm();
  });

  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

 /* Generate all works to remove */

  async function miniWorks(arrayWorks = dataWorks) {
    removeProjects.innerHTML = "";

    for (let i = 0; i < arrayWorks.length; i++) {
      const imgAndTrash = document.createElement("div");
      imgAndTrash.classList.add("imgAndTrash");
      removeProjects.appendChild(imgAndTrash);

      const imgProject = document.createElement("img");
      imgProject.src = arrayWorks[i].imageUrl;
      imgProject.alt = arrayWorks[i].title;
      imgAndTrash.appendChild(imgProject);

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can");
      imgAndTrash.appendChild(trashIcon);

      trashIcon.addEventListener("click", async () => {
        const token = localStorage.getItem("authToken");

        const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?");
        if (!confirmation) return;

        try {
            const response = await fetch(`http://localhost:5678/api/works/${arrayWorks[i].id}`, {
              method: "DELETE",
              headers: {Authorization: `Bearer ${token}`},
            });
    
            if (response.ok) {
              imgAndTrash.remove();
              dataWorks = dataWorks.filter((project) => project.id !== arrayWorks[i].id);
              genererWorks(dataWorks);
              alert("Projet supprimé avec succès !");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Erreur de connexion lors de la suppression.");
        }
      });
    };
  };
  miniWorks();

  /* Generate new picture project */

  function imagePreview() {
    const addPhotoInput = document.getElementById("addPhotoInput");
    const maxFileSize = 4 * 1024 * 1024;
    const validFileTypes = ["image/jpeg", "image/png"];

    addPhotoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > maxFileSize) {
        alert("Attention, leLe fichier est trop volumineux. La taille maximale est de 4 Mo.");
        event.target.value = "";
        return;
      }

      if (!validFileTypes.includes(file.type)) {
        alert("Format de fichier invalide. Veuillez sélectionner une image JPG ou PNG.");
        event.target.value = "";
        return;
      }

      addPhoto.querySelector("img").style.display = "none";
      addPhoto.querySelector("label").style.display = "none";
      addPhoto.querySelector("p").style.display = "none";

      const photoPreview = document.createElement("img");
      photoPreview.classList.add("photoPreview");
      photoPreview.src = URL.createObjectURL(file);
      photoPreview.alt = "Aperçu de l'image téléchargée";
      addPhoto.appendChild(photoPreview);
    });
  };

  /* Load category from API */

  async function loadCategories() {
    const categorySelected = document.getElementById("category");

    try {
      const response = await fetch("http://localhost:5678/api/categories");

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
      }

      const categories = await response.json();

      categorySelected.innerHTML = '<option value=""></option>';
      categories.forEach((ctg) => {
        const option = document.createElement("option");
        option.value = ctg.id;
        option.textContent = ctg.name;
        categorySelected.appendChild(option);
      });

    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
      categorySelected.innerHTML = '<option value="">Erreur de chargement</option>';
    }
  };
  loadCategories();

  /* Valid a project */

  newProjetcForms.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("addPhotoInput").files[0];

    if (!image || !title || !category) {
      displayError();
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {Authorization: `Bearer ${token}`,},
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      console.log("Nouveau projet ajouté :", newWork);

      dataWorks.push(newWork);
      genererWorks(dataWorks);
      miniWorks();
      resetAddForm();
      alert("Projet ajouté avec succès !");
      overlay.style.display = "none";
    };

  });

  function validButtonOk() {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const image = document.getElementById("addPhotoInput").files[0];

    const validInput = title && category && image;

    if (validInput) {
      validProject.disabled = false;
      validProject.classList.add("active");
      displayError(false);
    } else {
      validProject.disabled = true;
      validProject.classList.remove("active");
      displayError(true);
    };
  };

  function displayError(visible = true) {
    let errorMessage = document.querySelector(".errorValidMsg");

    if (visible) {
      if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.classList.add("errorValidMsg");
        newProjetcForms.appendChild(errorMessage);
      }
      errorMessage.textContent = "Attention : Tous les champs du formulaire doivent être complétés afin de pouvoir le valider.";
    } else {
      if (errorMessage) errorMessage.remove();
    };
  };

  /* Reset a project start */

  function resetAddForm() {
    const title = document.getElementById("title");
    const category = document.getElementById("category");

    addPhoto.innerHTML = `
      <img src="./assets/icons/picture.png" alt="Ajouter une photo" class="pictoPhoto">
      <label for="addPhotoInput" id="addPhotoLabel">+ Ajouter photo</label>
      <input type="file" name="addPhotoInput" id="addPhotoInput">
      <p>jpg, png : 4Mo max</p>
    `;
    title.value = "";
    category.value = "";
    validProject.classList.remove("active");
  };
};

run();
