const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const title = document.getElementById("note-title")


const range = document.createRange()
range.selectNodeContents(title)

const selection = window.getSelection()
selection.removeAllRanges()
selection.addRange(range)

sidebarToggle.addEventListener("click", ()=> {
    sidebar.classList.toggle("open")
    sidebarToggle.classList.toggle("on")
    console.log("clicked")
})