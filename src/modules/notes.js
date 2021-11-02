class myNotes {
  constructor() {
    this.deleteButton = document.querySelectorAll(".delete-note");
    this.events();
  }

  events() {
    this.deleteButton.forEach((el) => {
      el.addEventListener("click", (el) => {
        el.preventDefault();
        this.deleteNote();
      });
    });
  }

  deleteNote = () => {
    alert("Delete");
  };
}
export default myNotes;
