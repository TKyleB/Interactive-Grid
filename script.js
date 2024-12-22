const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toolbar = document.getElementById("toolbar")
const colorPicker = document.getElementById("colorPicker")
const addSwatchButton = document.getElementById("addSwatchButton")

canvas.height = 500;
canvas.width = 1200;

const gridRows = 200
const gridCols = 200
const cellSize = 25

const viewportRows = Math.ceil(canvas.height / cellSize)
const viewportCols = Math.ceil(canvas.width / cellSize)


let offsetX = (gridCols - viewportCols)/2 // Center initial starting point
let offsetY = (gridRows - viewportRows)/2 // Center inital starting point

let activeColor = "#000000" // Black
let activeTool
let isDragging = false
let startX = 0, startY = 0; // Track mouse position for dragging


// Logical Grid
const grid = []
for (let row = 0; row < gridRows; row++) {
    grid[row] = []
    for (let col = 0; col < gridCols; col++) {
        grid[row][col] = { color: (row + col) % 2 === 0 ? "silver" : "lightgray" };
        
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let row = 0; row < viewportRows; row++) {
        for (let col = 0; col < viewportCols; col++) {
            const gridRow = row + Math.floor(offsetY)
            const gridCol = col + Math.floor(offsetX)

            if (gridRow < gridRows && gridCol < gridCols) {
                const cell = grid[gridRow][gridCol]
                ctx.fillStyle = cell.color
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    ctx.fillStyle = "black"
    ctx.fillText(`Offset X: ${offsetX} Offset Y: ${offsetY}`, 10, 20)
}

function moveViewport(dx, dy) {
    offsetX = Math.max(0, Math.min(gridCols - viewportCols, offsetX + dx));
    offsetY = Math.max(0, Math.min(gridRows - viewportRows, offsetY + dy));
    drawGrid();
}

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            moveViewport(0, -1); // Move up
            break;
        case "ArrowDown":
            moveViewport(0, 1); // Move down
            break;
        case "ArrowLeft":
            moveViewport(-1, 0); // Move left
            break;
        case "ArrowRight":
            moveViewport(1, 0); // Move right
            break;
    }
});

canvas.addEventListener("mousedown", (e) => {
    if (e.button === 1 || e.button === 0 && activeTool == "pan") {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        canvas.style.cursor = "grabbing"
    }
})
canvas.addEventListener("mouseup", (e) => {
    if (e.button == 1 || e.button === 0 && activeTool == "pan") {
        isDragging = false
        if (e.button == 1) {
            canvas.style.cursor = "auto"
        }
        else {
            canvas.style.cursor = "grab"
        }
    }
})
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        movementX = -e.movementX / 10
        console.log(movementX)
        movementY = -e.movementY / 10
        startX = e.clientX
        starty = e.clientY

        movementX = Math.max(-1, Math.min(movementX, 1))
        movementY = Math.max(-1, Math.min(movementY, 1))
        moveViewport(movementX, movementY)
    }
})
canvas.addEventListener("click", (e) => {
    if (activeTool == "paint") {
        const rect = canvas.getBoundingClientRect()
        const col = Math.floor((e.clientX - rect.x) / cellSize + offsetX)
        const row = Math.floor((e.clientY - rect.y) / cellSize + offsetY)
        grid[row][col].color = activeColor
        drawGrid()
    }
})

// Switching between the diffferent tools on the toolbar
toolbar.addEventListener("change", (e) => {
    const toolbarSelects = document.getElementsByName("toolbar")
    let selectedTool
    for (let i = 0; i < toolbarSelects.length; i++) {
        if (toolbarSelects[i].checked) {
            selectedTool = toolbarSelects[i].value
            break
        }
    }
    switch (selectedTool) {
        case "paint":
            activeTool = "paint"
            break
        case "pan":
            activeTool = "pan"
            canvas.style.cursor = "grab"
            break
        default:
            console.log("error")
            break
        
    }
})

// Updating active color based on changes to color picker
colorPicker.addEventListener("change", (e) => {
    activeColor = colorPicker.value
})

// Add current active color to swatches & handles re-using already saved swatches
addSwatchButton.addEventListener("click", (e) => {
    const swatchButton = document.createElement("button")
    swatchButton.classList.add("swatch")
    swatchButton.style.backgroundColor = activeColor

    // Switching back to previously saved swatches
    swatchButton.addEventListener("click", (e) => {
        const color = swatchButton.style.backgroundColor
        colorPicker.value = rgbToHex(color)
        activeColor = color
    })

    const parent = document.getElementById("swatchHolder")
    parent.appendChild(swatchButton)
})

// Helper function to convert css background colors to Hex
function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    return `#${parseInt(match[0]).toString(16).padStart(2, '0')}${parseInt(match[1]).toString(16).padStart(2, '0')}${parseInt(match[2]).toString(16).padStart(2, '0')}`;
}
drawGrid()




