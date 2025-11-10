/* DATA RETRIEVAL AND RUN */

let data = [];

async function run() {

  const works = await fetch("http://localhost:5678/api/works");
  data = await works.json();
  console.log("All works : ", data);

  const token = localStorage.getItem("authToken");
  if (token) {
    console.log("Vous êtes en mode administrateur");
    activAdminMood();
  }

  genererWorks();
  activeFilters();
}

/* GENERATE ALL WORKS */

const sectionGallery = document.querySelector(".gallery");

function genererWorks(arrayWorks = data) {

  sectionGallery.innerHTML = "";

  for (let i = 0; i < arrayWorks.length; i++) {

    const article = document.createElement("article");
    sectionGallery.appendChild(article);

    const imgProject = document.createElement("img");
    imgProject.src = arrayWorks[i].imageUrl;
    imgProject.alt = arrayWorks[i].title;
    article.appendChild(imgProject);

    const titleProject = document.createElement("h3");
    titleProject.innerText = arrayWorks[i].title;
    article.appendChild(titleProject);
    titleProject.style.padding = "1em 0em";
  }
}

/* FILTERS */

const filters = document.querySelector(".filters");

function activeFilters() {

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
    const filtered = data.filter((work) => work.categoryId === 1);
    genererWorks(filtered);
    activeButton(objectFilter);
    console.log("Objects : ", filtered);
  });

  const appartmentsFilter = document.createElement("button");
  appartmentsFilter.textContent = "Appartements";
  filters.appendChild(appartmentsFilter);
  appartmentsFilter.addEventListener("click", () => {
    const filtered = data.filter((work) => work.categoryId === 2);
    genererWorks(filtered);
    activeButton(appartmentsFilter);
    console.log("Appartments : ", filtered);
  });

  const hotelsFilter = document.createElement("button");
  hotelsFilter.textContent = "Hôtels & Restaurants";
  filters.appendChild(hotelsFilter);
  hotelsFilter.addEventListener("click", () => {
    const filtered = data.filter((work) => work.categoryId === 3);
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
const editProjects = document.querySelector("#editProjects");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const topModal = document.querySelector(".topModal");
const closeModal = document.querySelector(".fa-xmark");
const backModal = document.querySelector(".fa-arrow-left");
const modalH3 = document.querySelector(".modal h3");
const removeProjects = document.querySelector(".removeProjects");
const newProjetcForms = document.querySelector(".newProjetcForms");
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
    validProject.style.display = "none";
    addProject.style.display = "block";

  };

  addProject.addEventListener("click", () => {
    modalAddProject();
  });

  function modalAddProject() {
    topModal.style.justifyContent = "space-between";
    backModal.style.display = "block";
    modalH3.textContent = "Ajout photo";
    newProjetcForms.style.display = "flex"
    removeProjects.style.display = "none";
    addProject.style.display = "none";
    validProject.style.display = "block";
  };

  backModal.addEventListener("click", () => {
    modalEditProject();
  });

  closeModal.addEventListener("click", () => {
    overlay.style.display = "none";
  });
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  async function miniWorks(arrayWorks = data) {
    sectionGallery.innerHTML = "";

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

        const response = await fetch(`http://localhost:5678/api/works/${arrayWorks[i].id}`, {
          method: "DELETE",
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.ok) {
          imgAndTrash.remove();
          data = data.filter((element) => element.id !== arrayWorks[i].id);
          genererWorks(data);
        }
      });
    };
  };
  miniWorks();
};

run();




