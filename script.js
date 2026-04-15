let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentEditId = null;

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Dark mode
document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Add note
document.getElementById("addBtn").addEventListener("click", () => {
  let title = document.getElementById("title").value.trim();
  let content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("Fill all fields!");
    return;
  }

  let note = {
    id: Date.now(),
    title,
    content,
    isLocked: false,
    password: "",
    expanded: false
  };

  notes.push(note);
  saveNotes();
  displayNotes();

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
});

// Display notes
function displayNotes() {
  let container = document.getElementById("notesContainer");
  container.innerHTML = "";

  notes.forEach(note => {
    let div = document.createElement("div");
    div.className = "note";

    if (note.isLocked) div.classList.add("locked");

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p class="note-text ${note.expanded ? "expanded" : ""}">
        ${note.isLocked && !note.expanded ? "🔒 Locked" : note.content}
      </p>

      <div class="actions">
        <button onclick="toggleView(${note.id})">View</button>
        <button onclick="editNote(${note.id})">Edit</button>
        <button onclick="deleteNote(${note.id})">Delete</button>
        <button onclick="lockNote(${note.id})">
          ${note.isLocked ? "Unlock" : "Lock"}
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

// View toggle
function toggleView(id) {
  let note = notes.find(n => n.id == id);

  if (note.isLocked && !note.expanded) {
    let pass = prompt("Enter password:");
    if (pass !== note.password) {
      alert("Wrong password ❌");
      return;
    }
  }

  note.expanded = !note.expanded;
  saveNotes();
  displayNotes();
}

// Delete
function deleteNote(id) {
  notes = notes.filter(note => note.id != id);
  saveNotes();
  displayNotes();
}

// Edit
function editNote(id) {
  let note = notes.find(n => n.id == id);

  if (note.isLocked) {
    let pass = prompt("Enter password:");
    if (pass !== note.password) {
      alert("Wrong password ❌");
      return;
    }
  }

  currentEditId = id;

  document.getElementById("editTitle").value = note.title;
  document.getElementById("editContent").value = note.content;

  let modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
}

// Update
function updateNote() {
  let note = notes.find(n => n.id == currentEditId);

  note.title = document.getElementById("editTitle").value;
  note.content = document.getElementById("editContent").value;

  saveNotes();
  displayNotes();

  let modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
  modal.hide();
}

// Lock/Unlock
function lockNote(id) {
  let note = notes.find(n => n.id == id);

  if (!note.isLocked) {
    let pass = prompt("Set password:");
    if (pass) {
      note.isLocked = true;
      note.password = pass;
    }
  } else {
    let pass = prompt("Unlock password:");
    if (pass === note.password) {
      note.isLocked = false;
      note.password = "";
    } else {
      alert("Wrong password ❌");
    }
  }

  saveNotes();
  displayNotes();
}

displayNotes();