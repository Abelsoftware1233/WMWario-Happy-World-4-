// === BESTAANDE KEY CODE MAPPINGS ===
var CTRL = 17;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var SPACE = 32;
var UP = 38;

// === TOUCH INPUT MAPPINGS (Nieuw) ===
// Deze mappen de ID van de virtuele knop naar de actie die we willen uitvoeren op de reducer.
const TOUCH_MAPPINGS = {
    // LINKS: Lopen en Scrollen
    'touch-left': { down: 'WALK_LEFT', up: 'BRAKE_LEFT', scroll: 'DECREASE_SCROLL_X' },
    // RECHTS: Lopen en Scrollen
    'touch-right': { down: 'WALK_RIGHT', up: 'BRAKE_RIGHT', scroll: 'INCREASE_SCROLL_X' },
    // SPRINGEN: Gewoon de JUMP actie
    'touch-jump': { down: 'JUMP' },
    // ACTIE (Fireball): Roept de actie op bij het loslaten (up)
    'touch-action': { up: 'SHOOT_FIREBALL' } 
};


// === BESTAANDE WINDOW EVENT LISTENERS ===

// Klik event voor het toevoegen van een 'tube' (Buis)
// Dit werkt op mobiel als een simpele tik op het scherm.
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
// 🚀 NIEUWE MOBIELE TOUCH EVENT LISTENERS 
// ==========================================================

// Haal de knoppen op die we in index.html hebben gemaakt
const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');
const touchJump = document.getElementById('touch-jump');
const touchAction = document.getElementById('touch-action');


/**
 * Verwerkt het indrukken van een virtuele knop (touchstart).
 * Stuurt de 'start' acties naar de reducer.
 */
function handleTouchStart(event) {
    // Voorkomt dat de browser de pagina scrollt/zoomt
    event.preventDefault(); 

    const buttonId = event.currentTarget.id;
    const actions = TOUCH_MAPPINGS[buttonId];
    
    if (actions) {
        // Beweging & Scrollen (Moeten zolang de knop ingedrukt is)
        if (actions.down) {
            window.reducer(actions.down);
        }
        if (actions.scroll) {
            window.reducer(actions.scroll);
        }
        // JUMP is een actie die meestal maar kort duurt (één keer aanroepen)
        if (buttonId === 'touch-jump') {
             window.reducer('JUMP');
        }
    }
}

/**
 * Verwerkt het loslaten van een virtuele knop (touchend).
 * Stuurt de 'stop' acties naar de reducer.
 */
function handleTouchEnd(event) {
    event.preventDefault(); 
    
    const buttonId = event.currentTarget.id;
    const actions = TOUCH_MAPPINGS[buttonId];
    
    if (actions) {
        // Stoppen met bewegen (Brake acties) en Fireball (Actie knop)
        if (actions.up) {
            window.reducer(actions.up); 
        }
    }
}


// Koppel de listeners aan de knoppen
if (touchLeft && touchRight && touchJump && touchAction) {
    [touchLeft, touchRight, touchJump, touchAction].forEach(button => {
        // Touch events voor mobiel
        button.addEventListener('touchstart', handleTouchStart);
        button.addEventListener('touchend', handleTouchEnd);
        button.addEventListener('touchcancel', handleTouchEnd); 

        // Muis events voor desktop testen
        button.addEventListener('mousedown', handleTouchStart);
        button.addEventListener('mouseup', handleTouchEnd);
    });
    console.log("Mobiele touch controls gekoppeld aan game acties.");
}
