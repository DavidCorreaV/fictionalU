class Search {
  constructor() {
    this.addHTML();
    this.openButton = document.querySelectorAll(".js-search-trigger");
    this.closeButton = document.getElementsByClassName("search-overlay__close");
    this.searchOverlay = document.getElementsByClassName("search-overlay");
    this.searchField = document.querySelector("#search-term");
    this.resultsDiv = document.querySelector(".search-overlay__results");
    this.previousValue;
    this.isOpen = false;
    this.searchTimeout;
    this.spinner = false;
    this.events();
  }
  events() {
    this.openButton.forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        this.openOverlay();
      })
    );
    this.closeButton[0].addEventListener("click", this.closeOverlay);
    window.document.addEventListener("keydown", this.keyPressHandler);
    this.searchField.addEventListener("keyup", this.doSearch);
  }

  doSearch = (e) => {
    if (this.searchField.value !== this.previousValue) {
      clearTimeout(this.searchTimeout);
      if (this.searchField.value) {
        !this.spinner &&
          (this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>');
        this.spinner = true;
        this.searchTimeout = setTimeout(this.getResults.bind(this), 500);
        this.previousValue = this.searchField.value;
      } else {
        this.resultsDiv.innerHTML = "";
        this.spinner = false;
      }
    }
  };

  getResults = () => {
    const value = this.searchField.value;
    async function load(search) {
      const url = `${universityData.root_url}/wp-json/university/v1/search?term=${search}`;
      const obj = await (await fetch(url)).json();
      return obj;
    }
    (async () => {
      try {
        const obj = await load(value);
        this.resultsDiv.innerHTML = `
        <div class="row">
            <div class="one-third">
            <h2 class="search-overlay__section-title"> General Information</h2>
            ${
              obj.general.length
                ? '<ul class="link-list min-list">'
                : "<p>No general information found.</p>"
            } 
        ${obj.general
          .map(
            (item) =>
              `<li><a href="${item.URL}">${item.title}</a> ${
                item.type === "post" ? `by ${item.authorname}` : ""
              }</li>`
          )
          .join("")}

        ${obj.general.length ? "</ul>" : ""}

            </div>
            <div class="one-third">
            <h2 class="search-overlay__section-title"> Programs </h2> 
            ${
              obj.program.length
                ? '<ul class="link-list min-list">'
                : "<p>No programs found.<a href='/programs'> View all</a></p>"
            } 
        ${obj.program
          .map(
            (item) =>
              `<li><a href="${item.URL}">${item.title}</a>
              </li>`
          )
          .join("")}

        ${obj.program.length ? "</ul>" : ""}

            <h2 class="search-overlay__section-title"> Professors </h2>
            ${
              obj.professor.length
                ? '<ul class="professor-cards">'
                : "<p>No professors found.</p>"
            } 
        ${obj.professor
          .map(
            (item) =>
              `
    <li class="professor-card__list-item">
        <a class="professor-card" href="${item.URL}">
            <img src="${item.image}" alt="" class="professor-card__image">
            <span class="professor-card__name">${item.title}</span>
        </a>
    </li>

              `
          )
          .join("")}

        ${obj.professor.length ? "</ul>" : ""}

            </div>
            <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>    ${
              obj.campus.length
                ? '<ul class="link-list min-list">'
                : "<p>No campuses found.<a href='/campuses'> View all</a></p>"
            } 
        ${obj.campus
          .map(
            (item) =>
              `<li><a href="${item.URL}">${item.title}</a> 
              </li>`
          )
          .join("")}

        ${obj.campus.length ? "</ul>" : ""}
            <h2 class="search-overlay__section-title">Events</h2>${
              obj.event.length
                ? ""
                : "<p>No events found.<a href='/events'> View all</a></p>"
            } 
        ${obj.event
          .map(
            (item) =>
              `
            <div class="event-summary">
                <a class="event-summary__date t-center" href="${item.URL}">
                    <span class="event-summary__month">${item.month}</span>
                    <span class="event-summary__day">${item.day}</span>
                </a>
                <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a
                            href="${item.URL}">${item.title}</a></h5>
                    <p> ${item.excerpt} <a href="${item.URL}"
                            class="nu gray">Learn more</a></p>
                </div>
            </div>
              `
          )
          .join("")}

        ${obj.event.length ? "</ul>" : ""}
            </div>
        </div>

                `;
        this.spinner = false;
      } catch (e) {
        console.log(e);
      }
    })();
  };

  keyPressHandler = (e) => {
    document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA" &&
      !this.isOpen &&
      e.keyCode === 83 &&
      this.openOverlay();
    this.isOpen && e.keyCode === 27 && this.closeOverlay();
  };

  openOverlay = () => {
    this.searchOverlay[0].classList.add("search-overlay--active");
    document.querySelector("body").classList.add("body-no-scroll");
    this.isOpen = true;
    setTimeout(() => this.searchField.focus(), 100);
    return false;
  };

  closeOverlay = () => {
    this.searchOverlay[0].classList.remove("search-overlay--active");
    document.querySelector("body").classList.remove("body-no-scroll");
    this.searchField.value = "";
    this.isOpen = false;
  };

  addHTML = () => {
    document.querySelector("body").insertAdjacentHTML(
      "beforeend",
      `<div class="search-overlay">
    <div class="search-overlay__top">
        <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" id="search-term" class="search-term" placeholder="What are you looking for">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
    </div>
    <div class="container">
        <div class="search-overlay__results">

        </div>
    </div>
</div>`
    );
  };
}
export default Search;
