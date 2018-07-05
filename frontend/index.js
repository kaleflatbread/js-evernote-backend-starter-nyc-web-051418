//elements
const sidebar = document.getElementById("sidebar");
const detail = document.getElementById("detail");
const notesURL = "http://localhost:3000/api/v1/notes";


const getNotes = fetch(notesURL)
  .then((res) => res.json())
  .then((json) => {
    let noteTitles = json.map((note)=>note.title)
    json.forEach((note)=>{
      handleNote(note)
    })
  })


const usersURL = "http://localhost:3000/api/v1/users";
const getUsers = fetch(usersURL);

//crud
patchNote = (noteID, postTitle, postBody) => {
  const postObj = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: postTitle,
      body: postBody,
    })
  }
  return fetch(`${notesURL}/${noteID}`,postObj);
}

deleteNote = (noteID) => {
  deleteObj = {
    method: "DELETE"
  }
  fetch(`${notesURL}/${noteID}`,deleteObj).then(renderOnDelete());
}

editSubmit = () => {
  const editSubmitButton = document.getElementById("editSubmitButton");
  const editTitle = document.getElementById("editTitle");
  const editNote = document.getElementById("editNote");
  editSubmitButton.addEventListener('click', event => {
    const editNoteID = parseInt(event.target.parentElement.id);
    const editPostTitle = editTitle.value;
    const editPostBody = editNote.value
    patchNote(editNoteID,editPostTitle,editPostBody);
  })
}


editClickEvent = () => {
  const editButton = document.getElementById("edit");
  editButton.addEventListener('click', event => {
    event.preventDefault();
    const elementWithData = event.target.parentElement;
    detail.innerHTML = `
      <form id="${elementWithData.dataset.id}">
        <label>Title</label>
        <input type="text" value="${elementWithData.dataset.title}" id="editTitle">
        <label>Note</label>
        <input type="text" value="${elementWithData.dataset.fullnote}" id="editNote">
        <button type="submit" id="editSubmitButton">Submit</button>
      </form> `
      editSubmit();
  })
}

renderOnDelete = () => {
  location.reload();
}

deleteClickEvent = () => {
  const deleteButton = document.getElementById("delete");
  deleteButton.addEventListener('click', event => {
    event.preventDefault();
    deleteNoteID = parseInt(event.target.parentElement.dataset.id);
    deleteNote(deleteNoteID);
  })
}

sidebar.addEventListener('click', event => {
  if (event.target.tagName === "h2") {
    displayClickedNote(event.target)
  }
})

displayClickedNote = (note) => {
  checkForChildNodes = detail.hasChildNodes();
  const noteHTML = `${note.dataset.title} <p data-id="${note.dataset.id}" data-fullnote="${note.dataset.fullnote}" data-title="${note.dataset.title}"> ${note.dataset.fullnote} <br> <button id="edit">Edit</button> <button id="delete">Delete</button> </p> `;
  if (checkForChildNodes) {
    detail.querySelector("h2").innerHTML = noteHTML;
  } else {
    let displayNote = document.createElement("H2");
    displayNote.innerHTML = noteHTML;
    detail.appendChild(displayNote);
  }
  editClickEvent();
  deleteClickEvent();
}


displaySideNotes = (notes) => {
  notes.forEach( note => {
    sidebar.innerHTML += `<div><h2 data-id="${note.id}" data-fullnote="${note.body}" data-title="${note.title}">${note.title}</h2><p>${note.body.slice(0,20)}...</p></div>`
  })
}
