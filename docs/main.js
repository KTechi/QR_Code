// ================================================== [50]
//     Main

'use strict'

let qrCode = new QR_Code(
    // VER, ECL, MP
    5, 'H', 6
)

function paint() {
    context.clearRect(0, 0, VW, VH)
    imageData = context.getImageData(0, 0, VW, VH)
    data = imageData.data
    const LEN = qrCode.LEN
    for (let y = 0; y < LEN + 4; y++)
    for (let x = 0; x < LEN + 4; x++) paintModule(x, y, 255)

    for (let y = 0; y < LEN; y++)
    for (let x = 0; x < LEN; x++) {
        switch (qrCode.matrix[y][x]) {
            case 0:  paintModule(2 + x, 2 + y, 1); break
            case 1:  paintModule(2 + x, 2 + y, 0); break
            default: paintModule(2 + x, 2 + y, .5)
        }
    }
    context.putImageData(imageData, 0, 0)
}
function paintModule(x, y, bit) {
    x = parseInt(x*moduleSize)
    y = parseInt(y*moduleSize)
    for (let dy = 0; dy < moduleSize; dy++)
    for (let dx = 0; dx < moduleSize; dx++) {
        const base = 4*(VW*(y + dy) + x + dx)
        data[base + 0] =
        data[base + 1] =
        data[base + 2] = parseInt(255 * bit)
        data[base + 3] = 255
    }
}

// ================================================== [50]
//     Window

window.onload = load
window.onresize = resize
function load() {
    document.body.append(canvas)
    resize()
}
function resize() {
    VW = parseInt(scale * canvas.clientWidth)
    VH = parseInt(scale * canvas.clientHeight)
    canvas.width  = VW
    canvas.height = VH
    paint()
}
function isMobile() {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return window.navigator.userAgent.search(regexp) !== -1
}

// ================================================== [50]
//     END
// ================================================== [50]