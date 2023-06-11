// ================ Main ================ //

'use strict'

let version
let ec_level
let mask
let mode
const error_message = document.createElement('div')

window.addEventListener('load', function() {
    // ======== Canvas ======== //
    const canvas_container = document.getElementById('canvas-container')
    new ResizeObserver(function(mutations) {
        const w = canvas_container.clientWidth
        const h = canvas_container.clientHeight
        const size = Math.min(w, h) - 50
        canvas.style.width  = size + 'px'
        canvas.style.height = size + 'px'
    }).observe(canvas_container, { attributes: true })

    // ======== Property ======== //
    const property_container = document.getElementById('property-container')
    const new_select = function(label_text) {
        const container = document.createElement('div')
        const label = document.createElement('div')
        const select = document.createElement('select')
        property_container.append(container)
        container.append(label)
        container.append(select)
        container.classList = 'select_container'
        label.classList = 'label'
        label.innerText = label_text
        return select
    }
    const addOption = function(element, value) {
        const option = document.createElement('option')
        option.textContent = value
        element.appendChild(option)
    }
    version  = new_select('Version')
    ec_level = new_select('EC Level')
    mask     = new_select('Mask')
    mode     = new_select('Mode')
    for (let i = 0; i < 40; i++)
        addOption(version, i+1)
    for (const val of ['L', 'M', 'Q', 'H'])
        addOption(ec_level, val)
    for (const val of [0, 1, 2, 3, 4, 5, 6, 7])
        addOption(mask, val)
    for (const val of ['Number', 'ABC123', 'Byte', 'Kanji'])
        addOption(mode, val)

    const button = document.createElement('button')
    property_container.append(button)
    button.textContent = 'run'
    button.addEventListener('click', run)

    property_container.append(error_message)
    error_message.classList = 'error-message'
})

function run() {
    const selected = function(select) {
        const i = select.selectedIndex
        return select.options[i].value
    }
    const qr_code = new QR_Code(
        selected(version),
        selected(ec_level),
        selected(mask),
        selected(mode),
        document.getElementById('textbox').value
    )
    const error = qr_code.error_message

    if (error == undefined || error == '') {
        error_message.innerText = ''
        paint(qr_code)
    } else
        error_message.innerText = qr_code.error_message
}

function paint(qr_code) {
    const LEN = qr_code.LEN
    const Cell_Size = qr_code.cell_size
    const Canvas_Size = (LEN+4) * Cell_Size
    canvas.width  = Canvas_Size
    canvas.height = Canvas_Size
    const imageData = context.getImageData(0, 0, Canvas_Size, Canvas_Size)
    const data = imageData.data

    for (let y = 0; y < LEN + 4; y++)
    for (let x = 0; x < LEN + 4; x++)
        paintCell(data, Canvas_Size, Cell_Size, x, y, 0)

    for (let y = 0; y < LEN; y++)
    for (let x = 0; x < LEN; x++)
    switch (qr_code.matrix[y][x]) {
        case 0:  paintCell(data, Canvas_Size, Cell_Size, 2+x, 2+y, 0); break
        case 1:  paintCell(data, Canvas_Size, Cell_Size, 2+x, 2+y, 1); break
        default: paintCell(data, Canvas_Size, Cell_Size, 2+x, 2+y, .5)
    }
    context.putImageData(imageData, 0, 0)
}

function paintCell(data, Canvas_Size, Cell_Size, x, y, bit) {
    x = parseInt(x*Cell_Size)
    y = parseInt(y*Cell_Size)
    for (let dy = 0; dy < Cell_Size; dy++)
    for (let dx = 0; dx < Cell_Size; dx++) {
        const base = 4*(Canvas_Size*(y + dy) + x + dx)
        data[base + 0] =
        data[base + 1] =
        data[base + 2] = parseInt(255 * (1-bit))
        data[base + 3] = 255
    }
}

// ================ Window Initialize ================ //

window.onload = load
function load() {
    document.getElementById('textbox').value = '12345'
    run()
}
function isMobile() {
    const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return window.navigator.userAgent.search(regexp) !== -1
}