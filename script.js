// Obtener referencias a los elementos del DOM
const noteList = document.getElementById('note-list');
const noteTitleInput = document.getElementById('note-title');
const noteContentTextarea = document.getElementById('note-content');
const newNoteBtn = document.getElementById('new-note-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');

let currentNoteId = null;

// Función para cargar las notas desde localStorage
function loadNotes() {
    // Obtener las notas del localStorage o un array vacío si no hay nada
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    noteList.innerHTML = ''; // Limpiar la lista actual

    // Iterar sobre las notas y agregarlas a la lista en el DOM
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.title;
        li.dataset.id = note.id;
        li.addEventListener('click', () => {
            displayNote(note.id);
        });
        noteList.appendChild(li);
    });
}

// Función para mostrar una nota seleccionada
function displayNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(n => n.id === id);

    // Actualizar el estado de la aplicación
    currentNoteId = id;
    noteTitleInput.value = note.title;
    noteContentTextarea.value = note.content;

    // Remover la clase 'active' de todos los elementos y agregarla al seleccionado
    document.querySelectorAll('#note-list li').forEach(li => {
        li.classList.remove('active');
    });
    const selectedLi = document.querySelector(`li[data-id='${id}']`);
    if (selectedLi) {
        selectedLi.classList.add('active');
    }
}

// Función para limpiar los campos y preparar para una nueva nota
function newNote() {
    noteTitleInput.value = '';
    noteContentTextarea.value = '';
    currentNoteId = null;
    document.querySelectorAll('#note-list li').forEach(li => {
        li.classList.remove('active');
    });
    noteTitleInput.focus();
}

// Función para guardar o actualizar una nota
function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentTextarea.value.trim();

    if (!title || !content) {
        alert('El título y el contenido no pueden estar vacíos.');
        return;
    }

    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (currentNoteId) {
        // Actualizar una nota existente (UPDATE)
        notes = notes.map(note => {
            if (note.id === currentNoteId) {
                return { id: currentNoteId, title, content };
            }
            return note;
        });
    } else {
        // Crear una nueva nota (CREATE)
        const newNote = {
            id: Date.now(), // Usamos la fecha y hora actual como ID único
            title,
            content
        };
        notes.push(newNote);
        currentNoteId = newNote.id;
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
    displayNote(currentNoteId);
}

// Función para borrar una nota
function deleteNote() {
    if (!currentNoteId) {
        alert('Selecciona una nota para borrar.');
        return;
    }

    if (confirm('¿Estás seguro de que quieres borrar esta nota?')) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== currentNoteId);

        localStorage.setItem('notes', JSON.stringify(notes));
        newNote();
        loadNotes();
    }
}

// Asociar los botones a sus funciones
newNoteBtn.addEventListener('click', newNote);
saveNoteBtn.addEventListener('click', saveNote);
deleteNoteBtn.addEventListener('click', deleteNote);

// Cargar las notas al inicio
loadNotes();