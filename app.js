// ─── CLEAN OLD LOCALSTORAGE FORMAT ────────────────────────────
// Guard against corrupted or old-format data crashing the app
try {
    const t = localStorage.getItem("notsidian_theme")
    if (t && !t.startsWith("{")) localStorage.removeItem("notsidian_theme")
} catch(e) {}

// ─── DEVICE DETECTION ─────────────────────────────────────────
// Detect if the device supports hover (i.e. has a real pointer/mouse)
const isHoverDevice = window.matchMedia("(hover: hover)").matches

// ─── DOM REFERENCES ───────────────────────────────────────────
const sidebar             = document.getElementById("sidebar")
const sidebarToggle       = document.getElementById("toggle-sidebar")
const hoverZone           = document.getElementById("hover-zone")
const hoverToggleRow      = document.getElementById("hover-toggle-row")
const hoverToggleBtn      = document.getElementById("hover-toggle")
const notesList           = document.getElementById("notes-list")
const newNoteBtn          = document.getElementById("new-note")
const noteTitle           = document.getElementById("note-title")
const noteBody            = document.getElementById("note-body")
const optionsBtn          = document.getElementById("options-btn")
const optionsPanel        = document.getElementById("options-panel")
const optionsClose        = document.getElementById("options-close")
const saveMdBtn           = document.getElementById("save-md")
const loadMdBtn           = document.getElementById("load-md")
const fileInput           = document.getElementById("file-input")
const themeOption         = document.getElementById("theme-option")
const themePanel          = document.getElementById("theme-panel")
const themeClose          = document.getElementById("theme-close")
const saveThemeBtn        = document.getElementById("save-theme")
const pickBg              = document.getElementById("pick-bg")
const pickSidebar         = document.getElementById("pick-sidebar")
const pickText            = document.getElementById("pick-text")
const pickBorder          = document.getElementById("pick-border")
const syncIndicator       = document.getElementById("sync-indicator")
const defaultSwatches     = document.getElementById("default-swatches")
const customSwatches      = document.getElementById("custom-swatches")
const customSection       = document.getElementById("custom-themes-section")

// ─── HOVER SIDEBAR — DESKTOP ONLY ─────────────────────────────
// Only show the hover option on devices with a real pointer
if (!isHoverDevice) {
    hoverToggleRow.style.display = "none"
}

let hoverSidebarEnabled = localStorage.getItem("notsidian_hover") === "true" && isHoverDevice

function applyHoverSidebarMode() {
    if (hoverSidebarEnabled) {
        sidebarToggle.style.display = "none"
        hoverZone.style.display     = "block"
        hoverToggleBtn.setAttribute("aria-checked", "true")
    } else {
        sidebarToggle.style.display = ""
        hoverZone.style.display     = "none"
        hoverToggleBtn.setAttribute("aria-checked", "false")
    }
}

applyHoverSidebarMode()

hoverToggleBtn.addEventListener("click", () => {
    hoverSidebarEnabled = !hoverSidebarEnabled
    localStorage.setItem("notsidian_hover", hoverSidebarEnabled)
    applyHoverSidebarMode()
})

// Hover zone — open sidebar when mouse enters the left strip
hoverZone.addEventListener("mouseenter", () => {
    sidebar.classList.add("open")
})

// Close sidebar when mouse leaves it (hover mode only)
sidebar.addEventListener("mouseleave", () => {
    if (hoverSidebarEnabled) sidebar.classList.remove("open")
})

// ─── PRESETS ──────────────────────────────────────────────────
const PALETTES = {
    light:    { bg:"#f5f2ed", sidebar:"#e8e4de", text:"#1a1a1a", border:"#ccc8c0", muted:"#777" },
    dark:     { bg:"#0e0e0e", sidebar:"#161616", text:"#e8e4dc", border:"#333333", muted:"#888" },
    gruvbox:  { bg:"#282828", sidebar:"#1d2021", text:"#ebdbb2", border:"#504945", muted:"#a89984" },
    nord:     { bg:"#2e3440", sidebar:"#242933", text:"#eceff4", border:"#4c566a", muted:"#8892a4" },
    rosepine: { bg:"#191724", sidebar:"#1f1d2e", text:"#e0def4", border:"#393552", muted:"#908caa" }
}

// ─── CUSTOM THEMES ────────────────────────────────────────────
// Stored as { "Theme Name": { bg, sidebar, text, border }, ... }
let customThemes = {}
try {
    const saved = localStorage.getItem("notsidian_custom_themes")
    if (saved) customThemes = JSON.parse(saved)
} catch(e) {}

function saveCustomThemes() {
    try { localStorage.setItem("notsidian_custom_themes", JSON.stringify(customThemes)) } catch(e) {}
}

function renderCustomSwatches() {
    customSwatches.innerHTML = ""
    const names = Object.keys(customThemes)

    if (names.length === 0) {
        customSection.classList.add("hidden")
        return
    }

    customSection.classList.remove("hidden")

    names.forEach(name => {
        const t   = customThemes[name]
        const btn = document.createElement("button")
        btn.className = "swatch"
        btn.title = name
        btn.innerHTML = `
            <div class="swatch-colors">
                <span style="background:${t.bg}"></span>
                <span style="background:${t.sidebar}"></span>
                <span style="background:${t.text}"></span>
                <span style="background:${t.border}"></span>
            </div>
            <span class="swatch-label">${name}</span>
            <button class="swatch-delete" title="Delete ${name}" aria-label="Delete theme ${name}">✕</button>
        `

        // Apply this custom theme on click
        btn.addEventListener("click", (e) => {
            if (e.target.classList.contains("swatch-delete")) return
            applyTheme(t)
            localStorage.setItem("notsidian_theme", JSON.stringify(t))
            highlightActiveSwatch(btn)
        })

        // Delete custom theme
        btn.querySelector(".swatch-delete").addEventListener("click", (e) => {
            e.stopPropagation()
            if (!confirm(`Delete theme "${name}"?`)) return
            delete customThemes[name]
            saveCustomThemes()
            renderCustomSwatches()
        })

        customSwatches.appendChild(btn)
    })
}

renderCustomSwatches()

// ─── APPLY THEME ──────────────────────────────────────────────
function applyTheme(t) {
    const r = document.documentElement.style
    r.setProperty("--bg",         t.bg)
    r.setProperty("--sidebar-bg", t.sidebar)
    r.setProperty("--text",       t.text)
    r.setProperty("--border",     t.border)
    // Use explicit muted if provided, otherwise derive from text at 45% opacity via a mid-tone
    r.setProperty("--muted",      t.muted || "#888")
    // Sync color pickers
    pickBg.value      = t.bg
    pickSidebar.value = t.sidebar
    pickText.value    = t.text
    pickBorder.value  = t.border
}

// ─── DETECT DARK COLOUR ───────────────────────────────────────
// Used to keep sun/moon icon in sync with custom colours
function isColorDark(hex) {
    const r = parseInt(hex.slice(1,3), 16)
    const g = parseInt(hex.slice(3,5), 16)
    const b = parseInt(hex.slice(5,7), 16)
    // Perceived brightness formula
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128
}

function highlightActiveSwatch(activeBtn) {
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("active-palette"))
    if (activeBtn) activeBtn.classList.add("active-palette")
}

// ─── LOAD SAVED THEME ─────────────────────────────────────────
try {
    const saved = localStorage.getItem("notsidian_theme")
    if (saved) {
        const t = JSON.parse(saved)
        applyTheme(t)
        isDark = isColorDark(t.bg)
    } else {
        applyTheme(PALETTES.light)
    }
} catch(e) {
    applyTheme(PALETTES.light)
}

// ─── QUICK THEME TOGGLE removed — use theme panel instead ─────

// ─── DEFAULT PRESET SWATCHES ──────────────────────────────────
// Clicking a preset applies AND saves immediately — no extra button needed
defaultSwatches.querySelectorAll(".swatch").forEach(btn => {
    btn.addEventListener("click", () => {
        const palette = PALETTES[btn.dataset.palette]
        if (!palette) return
        applyTheme(palette)
        localStorage.setItem("notsidian_theme", JSON.stringify(palette))
        highlightActiveSwatch(btn)
    })
})

// ─── LIVE COLOR PICKERS ───────────────────────────────────────
function getLiveTheme() {
    return { bg: pickBg.value, sidebar: pickSidebar.value, text: pickText.value, border: pickBorder.value }
}

;[pickBg, pickSidebar, pickText, pickBorder].forEach(p => {
    p.addEventListener("input", () => {
        applyTheme(getLiveTheme())
        highlightActiveSwatch(null) // deselect presets when customising
    })
})

// ─── SAVE AS CUSTOM THEME ─────────────────────────────────────
saveThemeBtn.addEventListener("click", () => {
    const name = prompt("Name this theme:")
    if (!name || !name.trim()) return
    const trimmed = name.trim()
    customThemes[trimmed] = getLiveTheme()
    saveCustomThemes()
    localStorage.setItem("notsidian_theme", JSON.stringify(customThemes[trimmed]))
    renderCustomSwatches()
    // Highlight newly added swatch
    const newBtn = Array.from(customSwatches.querySelectorAll(".swatch"))
        .find(b => b.title === trimmed)
    highlightActiveSwatch(newBtn)
})

// ─── NOTES STATE ──────────────────────────────────────────────
let notes     = {}
let currentId = null

try {
    const saved = localStorage.getItem("notsidian_notes")
    if (saved) {
        notes = JSON.parse(saved)
        const ids = Object.keys(notes)
        if (ids.length > 0) {
            currentId = ids.sort((a,b) => notes[b].updated - notes[a].updated)[0]
            noteTitle.innerText = notes[currentId].noteTitle || "Untitled"
            noteBody.innerText  = notes[currentId].noteBody  || ""
        }
    }
} catch(e) {
    localStorage.removeItem("notsidian_notes")
    notes = {}
}

renderNotes()
if (Object.keys(notes).length === 0) selectTitle()

// ─── SELECT TITLE ─────────────────────────────────────────────
function selectTitle() {
    const range = document.createRange()
    range.selectNodeContents(noteTitle)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    noteTitle.focus()
}

noteTitle.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); noteBody.focus() }
})

// ─── SYNC INDICATOR ───────────────────────────────────────────
let syncTimer    = null
let saveTimer    = null

function setSyncTyping() {
    syncIndicator.classList.remove("saved")
    syncIndicator.classList.add("typing")
}

function setSyncSaved() {
    syncIndicator.classList.remove("typing")
    syncIndicator.classList.add("saved")
    // Fade back to idle after 1.5s
    clearTimeout(syncTimer)
    syncTimer = setTimeout(() => syncIndicator.classList.remove("saved"), 1500)
}

// ─── AUTOSAVE ─────────────────────────────────────────────────
function autosave() {
    if (!currentId) {
        currentId = Date.now()
        notes[currentId] = { noteTitle: "", noteBody: "", updated: currentId }
    }

    notes[currentId].noteTitle = noteTitle.innerText
    notes[currentId].noteBody  = noteBody.innerText
    notes[currentId].updated   = Date.now()

    setSyncTyping()

    // Debounce: wait 700ms after last keystroke to actually save
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
        try { localStorage.setItem("notsidian_notes", JSON.stringify(notes)) } catch(e) {}
        setSyncSaved()
        renderNotes()
    }, 700)
}

noteTitle.addEventListener("input", autosave)
noteBody.addEventListener("input",  autosave)

// ─── SIDEBAR TOGGLE ───────────────────────────────────────────
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open")
})

document.getElementById("sidebar-close").addEventListener("click", () => {
    sidebar.classList.remove("open")
})

// Close sidebar and panels when tapping outside
document.addEventListener("click", e => {
    const inside = sidebar.contains(e.target)
                || sidebarToggle.contains(e.target)
                || optionsPanel.contains(e.target)
                || themePanel.contains(e.target)
    if (!inside) {
        sidebar.classList.remove("open")
        closeOptionsPanel()
    }
})

// ─── NEW NOTE ─────────────────────────────────────────────────
newNoteBtn.addEventListener("click", () => {
    const id = Date.now()
    currentId = id
    notes[id] = { noteTitle: "Untitled", noteBody: "", updated: id }
    try { localStorage.setItem("notsidian_notes", JSON.stringify(notes)) } catch(e) {}
    noteTitle.innerText = "Untitled"
    noteBody.innerText  = ""
    sidebar.classList.remove("open")
    renderNotes()
    selectTitle()
})

// ─── RENDER NOTES LIST ────────────────────────────────────────
function renderNotes() {
    notesList.innerHTML = ""
    const ids = Object.keys(notes).sort((a,b) => notes[b].updated - notes[a].updated)

    if (ids.length === 0) {
        notesList.innerHTML = "<p class='empty'>no notes yet.</p>"
        return
    }

    ids.forEach(id => {
        const item = document.createElement("div")
        item.className = "note-item" + (String(id) === String(currentId) ? " active" : "")

        const span = document.createElement("span")
        span.className = "note-item-title"
        span.innerText = notes[id].noteTitle || "Untitled"

        const trash = document.createElement("button")
        trash.className   = "note-delete"
        trash.title       = "Delete note"
        trash.setAttribute("aria-label", "Delete note")
        trash.innerHTML   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`

        trash.addEventListener("click", e => { e.stopPropagation(); deleteNote(id) })

        item.addEventListener("click", () => {
            currentId           = id
            noteTitle.innerText = notes[id].noteTitle || "Untitled"
            noteBody.innerText  = notes[id].noteBody  || ""
            sidebar.classList.remove("open")
            renderNotes()
        })

        item.appendChild(span)
        item.appendChild(trash)
        notesList.appendChild(item)
    })
}

// ─── DELETE NOTE ──────────────────────────────────────────────
function deleteNote(id) {
    if (!confirm(`Delete "${notes[id]?.noteTitle || "this note"}"?`)) return
    delete notes[id]
    try { localStorage.setItem("notsidian_notes", JSON.stringify(notes)) } catch(e) {}

    const remaining = Object.keys(notes).sort((a,b) => notes[b].updated - notes[a].updated)
    if (remaining.length > 0) {
        currentId           = remaining[0]
        noteTitle.innerText = notes[currentId].noteTitle
        noteBody.innerText  = notes[currentId].noteBody
    } else {
        currentId           = null
        noteTitle.innerText = "Untitled"
        noteBody.innerText  = ""
        selectTitle()
    }
    renderNotes()
}

// ─── OPTIONS PANEL ────────────────────────────────────────────
function closeOptionsPanel() { optionsPanel.classList.add("hidden") }

optionsBtn.addEventListener("click", e => {
    e.stopPropagation()
    optionsPanel.classList.toggle("hidden")
})
optionsClose.addEventListener("click", closeOptionsPanel)

// ─── SAVE .MD ─────────────────────────────────────────────────
function saveMd() {
    if (!currentId || !notes[currentId]) return
    const t    = notes[currentId].noteTitle || "untitled"
    const b    = notes[currentId].noteBody  || ""
    const blob = new Blob([`# ${t}\n\n${b}`], { type: "text/markdown" })
    const a    = document.createElement("a")
    a.href     = URL.createObjectURL(blob)
    a.download = t.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md"
    a.click()
    URL.revokeObjectURL(a.href)
    closeOptionsPanel()
}

saveMdBtn.addEventListener("click", saveMd)
document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveMd() }
})

// ─── LOAD .MD ─────────────────────────────────────────────────
loadMdBtn.addEventListener("click", () => { fileInput.click(); closeOptionsPanel() })

fileInput.addEventListener("change", e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
        const id = Date.now()
        currentId = id
        notes[id] = {
            noteTitle: file.name.replace(/\.(md|txt)$/i, ""),
            noteBody:  ev.target.result,
            updated:   id
        }
        try { localStorage.setItem("notsidian_notes", JSON.stringify(notes)) } catch(e) {}
        noteTitle.innerText = notes[id].noteTitle
        noteBody.innerText  = notes[id].noteBody
        sidebar.classList.remove("open")
        renderNotes()
    }
    reader.readAsText(file)
    e.target.value = ""
})

// ─── THEME PANEL ──────────────────────────────────────────────
function closeThemePanel() { themePanel.classList.add("hidden") }

themeOption.addEventListener("click", () => {
    themePanel.classList.toggle("hidden")
    closeOptionsPanel()
})
themeClose.addEventListener("click", closeThemePanel)
