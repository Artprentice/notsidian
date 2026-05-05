const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")

sidebarToggle.addEventListener(onclick, ()=> {
    sidebar.classList.toggle("open")
})