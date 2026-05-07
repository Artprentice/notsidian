const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const editor = document.getElementById("editor")
const title = document.getElementById("note-title")
const body = document.getElementById("note-body")
const newNote = document.getElementById("new-note")

const savedTitle = localStorage.getItem('notsidian_title')
const savedBody = localStorage.getItem('notsidian_body')

const notes = {}
let id
let noteTitle
let noteBody
let updated


savedTitle ? title.innerText = savedTitle : title.innerText = "Untitled"
savedBody ? body.innerText = savedBody : body.innerText = ""

const range = document.createRange()
range.selectNodeContents(title)

const selection = window.getSelection()
selection.removeAllRanges()
selection.addRange(range)

title.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        body.focus()

    }
})


sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open")
    editor.classList.toggle("open")
    sidebarToggle.style.display = "none"
    sidebarToggle.classList.toggle("on")
    console.log("clicked")
})

sidebar.addEventListener("transitionend", () => {
    if (!sidebar.classList.contains("open")) {
        sidebarToggle.style.display = "block"
    }
})

newNote.addEventListener("click", () => {
    saveNotes()
    
    title.innerText = "Untitled"
    body.innerText = ""
    sidebar.classList.toggle("open")
    editor.classList.toggle("open")
    sidebar.classList.toggle("on")
    sidebarToggle.classList.toggle("on")
    renderNotes()
})



document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && e.target !== sidebarToggle){
        sidebar.classList.remove("open")
        editor.classList.remove("open")
    }
})



function saveNotes (){
    id = Date.now()
    notes[id] = {
        noteTitle: title.innerText,
        noteBody: body.innerText,
        updated: id
    }
    localStorage.setItem("notsidian_notes", JSON.stringify(notes))
}

function renderNotes(){
    notesList.innerHtml = ""
    Object.keys(notes).forEach(id => {
        const div = document.createElement("div")
        div.innerText = notes[id].title
        notesList.appendChild(div)
    })
}
