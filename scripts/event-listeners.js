// === BESTAANDE KEY CODE MAPPINGS ===
var CTRL = 17;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var SPACE = 32;
var UP = 38;

// === TOUCH INPUT MAPPINGS ===
const TOUCH_MAPPINGS = {
    'touch-left': { down: 'WALK_LEFT', up: 'BRAKE_LEFT', scroll: 'DECREASE_SCROLL_X' },
    'touch-right': { down: 'WALK_RIGHT', up: 'BRAKE_RIGHT', scroll: 'INCREASE_SCROLL_X' },
    'touch-jump': { down: 'JUMP' },
    'touch-action': { up: 'SHOOT_FIREBALL' } 
};


// === BESTAANDE WINDOW EVENT LISTENERS ===

// Klik/Tik event voor het toevoegen van een 'tube' (Buis)
window.addEventListener('click', function(event) {
  // Voorkom dat klikken op de touch knoppen buizen toevoegen
  if (event.target.id.startsWith('touch-')) {
      return; 
  }
  
  // De buis toevoeg functie
  this('ADD_TUBE', {
    x: event.clientX,
    y: event.clientY
  });
}.bind(window.reducer));

// Toets indrukken (keydown)
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case LEFT:
      this('DECREASE_SCROLL_X');
      this('WALK_LEFT');
      break;
    case RIGHT:
      this('INCREASE_SCROLL_X');
      this('WALK_RIGHT');
      break;
    case SPACE:
      this('JUMP');
      break;
    default:
      this('LOG', 'Unbound key: ' + event.keyCode);
  }
}.bind(window.reducer));

// Toets loslaten (keyup)
window.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case CTRL:
      this('SHOOT_FIREBALL');
      break;
    case LEFT:
      this('BRAKE_LEFT');
      break;
    case RIGHT:
      this('BRAKE_RIGHT');
      break;
  }
}.bind(window.reducer));

// Resize event
window.addEventListener('resize', function() {
  window.reducer('RESIZE_WINDOW');
});


// ==========================================================
// 🚀 MOBIELE TOUCH EVENT LISTENERS 
// ==========================================================

// Haal de knoppen op die we in index.html hebben gemaakt
const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');
const touchJump = document.getElementById('touch-jump');
const touchAction = document.getElementById('touch-action');


/**
 * Verwerkt het indrukken van een virtuele knop (touchstart).
 */
function handleTouchStart(event) {
    event.preventDefault(); 

    const buttonId = event.currentTarget.id;
    const actions = TOUCH_MAPPINGS[buttonId];
    
    if (actions) {
        if (actions.down) {
            window.reducer(actions.down);
        }
        if (actions.scroll) {
            window.reducer(actions.scroll);
        }
        if (buttonId === 'touch-jump') {
             window.reducer('JUMP');
        }
    }
}

/**
 * Verwerkt het loslaten van een virtuele knop (touchend).
 */
function handleTouchEnd(event) {
    event.preventDefault(); 
    
    const buttonId = event.currentTarget.id;
    const actions = TOUCH_MAPPINGS[buttonId];
    
    if (actions) {
        if (actions.up) {
            window.reducer(actions.up); 
        }
    }
}


// Koppel de listeners aan de knoppen
if (touchLeft && touchRight && touchJump && touchAction) {
    [touchLeft, touchRight, touchJump, touchAction].forEach(button => {
        // Touch events
        button.addEventListener('touchstart', handleTouchStart);
        button.addEventListener('touchend', handleTouchEnd);
        button.addEventListener('touchcancel', handleTouchEnd); 

        // Muis events
        button.addEventListener('mousedown', handleTouchStart);
        button.addEventListener('mouseup', handleTouchEnd);
    });
    console.log("Mobiele touch controls gekoppeld aan game acties.");
}
