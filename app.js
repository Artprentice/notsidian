const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const editor = document.getElementById("editor")
const title = document.getElementById("note-title")
const body = document.getElementById("note-body")

const savedTitle = localStorage.getItem('notsidian_title')
const savedBody = localStorage.getItem('notsidian_body')


savedTitle ? title.innerText = savedTitle : title.innerText = "yup"
savedBody ? body.innerText = savedBody : body.innerText = "done"

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

body.addEventListener("input", () => {
    localStorage.setItem('notsidian_title', title.innerText)
    localStorage.setItem('notsidian_body', body.innerText)
})