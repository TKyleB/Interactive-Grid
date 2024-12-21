const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.height = 800;
canvas.width = 1200;

const gridRows = 200
const gridCols = 200
const cellSize = 25

const viewportRows = Math.ceil(canvas.height / cellSize)
const viewportCols = Math.ceil(canvas.width / cellSize)


let offsetX = (gridCols - viewportCols)/2 // Center initial starting point
let offsetY = (gridRows - viewportRows)/2 // Center inital starting point

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
    if (e.button === 1) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
        canvas.style.cursor = "grab"
    }
})
canvas.addEventListener("mouseup", (e) => {
    if (e.button == 1) {
        isDragging = false
        canvas.style.cursor = "auto"
    }
})
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        movementX = -(e.clientX - startX) / 2
        movementY = -(e.clientY - startY) / 2
        startX = e.clientX
        starty = e.clientY

        movementX = Math.max(-0.5, Math.min(movementX, 0.5))
        movementY = Math.max(-1, Math.min(movementY, 1))
        moveViewport(movementX, movementY)
    }
})
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.x) / cellSize + offsetX)
    const row = Math.floor((e.clientY - rect.y) / cellSize + offsetY)
    grid[row][col].color = "red"
    drawGrid()
})

drawGrid()




