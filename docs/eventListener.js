// ================================================== [50]
//     Definition

'use strict'


//canvas.addEventListener('mousemove', mousemove, false)
function mousemove(event) {
  if (document.pointerLockElement === canvas) {
    console.log(event.movementX, event.movementY)
  }
  
  if (event.buttons === 1) {
    console.log('drag')
  }
}

// ================================================== [50]
//     Key Listener

document.addEventListener('keypress', keypress, false)
document.addEventListener('keydown' , keydown , false)
document.addEventListener('keyup'   , keyup   , false)
function keypress(event) {}
function keydown(event) {}
function keyup(event) {}

// ================================================== [50]
//     END
// ================================================== [50]