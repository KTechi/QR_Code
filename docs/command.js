// ================================================== [50]
//     Key Listener

'use strict'

const input = document.createElement('input')
const log = []
input.addEventListener('focus', (e) => {
    input.style.opacity = 1
    input.style.backdropFilter = 'blur(10px)'
})
input.addEventListener('blur', (e) => {
    input.style.opacity = .5
    input.style.backdropFilter = 'blur(0px)'
})
input.addEventListener('change', (e) => {})

window.addEventListener('load', init_command)
function init_command() {
    const log_container = document.getElementById('log-container')
    for (let i = 0; i < 10; i++) {
        const div = document.createElement('div')
        div.classList.add('log')
        log_container.append(div)
        log.push(div)
    }
    const form = document.querySelector('form')
    form.addEventListener('submit', submit)
    form.append(input)
    input.style.opacity = .5
}
function submit(event) {
    event.preventDefault()
    if (input.value === '') return

    const len = log.length
    for (let i = 1; i < len; i++)
        log[i-1].innerText = log[i].innerText
    log[len-1].innerText = input.value

    // ========================= //
    const token = input.value.split(' ')
    let num = 0
    switch (token[0]) {
        case 'clear':
            for (const l of log) l.innerText = ''
            break
        case 'hide':
            if (token[1] === 'log')
                document.getElementById('log-container').style.visibility = 'hidden'
            break
        case 'show':
            if (token[1] === 'log')
                document.getElementById('log-container').style.visibility = 'visible'
            break
        case 'size':
            num = parseInt(token[1])
            if (Number.isInteger(num)) {
                moduleSize = num
                paint()
            }
            break
        case 'mp': // mask pattern
            num = parseInt(token[1])
            if (Number.isInteger(num) && 0 <= num && num <= 7) {
                qrCode = new QR_Code(
                    // VER, ECL, MP
                    5, 'H', num
                )
                paint()
            }
            break
        default:
            console.log(token)
    }
    // ========================= //

    input.value = ''
}

document.addEventListener('keydown', keydown, false)
function keydown(event) {
    if (event.key === 'Enter') {
        if (document.activeElement !== input) input.focus()
        else if (input.value === '')          input.blur()
        return
    }
}

// ================================================== [50]
//     END
// ================================================== [50]