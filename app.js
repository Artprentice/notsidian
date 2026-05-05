const sidebarToggle = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")

sidebarToggle.addEventListener("click", ()=> {
    sidebar.classList.toggle("open")
    console.log("clicked")
})