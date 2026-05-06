const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const editor = document.getElementById("editor")
const title = document.getElementById("note-title")
const body = document.getElementById("note-body")


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

sidebarToggle.addEventListener("click", ()=> {
    sidebar.classList.toggle("open")
    editor.classList.toggle("open")
    sidebarToggle.classList.toggle("on")
    console.log("clicked")
})