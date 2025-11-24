// === BESTAANDE KEY CODE MAPPINGS (Behouden voor desktop) ===
var CTRL = 17;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var SPACE = 32;
var UP = 38;

// === GLOBALE TOUCHE STATUS ===
// Houdt bij of de speler loopt, zodat we BRAKE/stoppen bij touchend.
let isWalking = false; 


// === BESTAANDE WINDOW EVENT LISTENERS (Voor desktop) ===

// Klik/Tik event voor het toevoegen van een 'tube' (Buis)
window.addEventListener('click', function(event) {
  // Als we al een 'touchstart' hebben verwerkt, negeren we de click
  // (Dit is nodig om te voorkomen dat een tik zowel Mario bestuurt én een buis plaatst)
  if (isWalking) {
      isWalking = false; // Reset de status
      return; 
  }
  
  // De buis toevoeg functie (voor de 'rest' van de clicks/taps)
  this('ADD_TUBE', {
    x: event.clientX,
    y: event.clientY
  });
}.bind(window.reducer));

// Keyboard listeners blijven ongewijzigd
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

window.addEventListener('resize', function() {
  window.reducer('RESIZE_WINDOW');
});


// ==========================================================
// 🚀 NIEUWE TOUCHSCREEN ZONES LOGICA 
// ==========================================================

/**
 * Berekent de actie op basis van de aanraakpositie (x, y).
 * Het scherm wordt verdeeld in 4 zones.
 */
function handleTouchStart(event) {
    // Cruciaal: Gebruik event.changedTouches[0] om de positie van de eerste aanraking te krijgen
    const touch = event.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    // Dimensies van het scherm
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    // 1. LINKSBOVEN: Lopen naar links
    if (x < halfWidth && y < halfHeight) {
        window.reducer('DECREASE_SCROLL_X');
        window.reducer('WALK_LEFT');
        isWalking = true;
    } 
    // 2. RECHTSBOVEN: Lopen naar rechts
    else if (x >= halfWidth && y < halfHeight) {
        window.reducer('INCREASE_SCROLL_X');
        window.reducer('WALK_RIGHT');
        isWalking = true;
    } 
    // 3. RECHTSONDER: Springen
    else if (x >= halfWidth && y >= halfHeight) {
        window.reducer('JUMP');
        // Springen is een korte actie, dus we zetten isWalking niet op true.
    } 
    // 4. LINKSONDER: Vuurbal afschieten
    else if (x < halfWidth && y >= halfHeight) {
        // Vuurbal afschieten is een actie bij touchend (op het loslaten), 
        // maar de reducer wil het vaak bij de 'shoot' actie.
        window.reducer('SHOOT_FIREBALL');
    }
}

/**
 * Stuurt de 'BRAKE' actie wanneer de vinger wordt losgelaten.
 * Dit is ALLEEN nodig als we aan het lopen waren.
 */
function handleTouchEnd(event) {
    // We moeten weten welk gedeelte van het scherm is losgelaten
    const touch = event.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    // Als de vinger wordt opgetild uit de LINKSBOVEN zone (walk left)
    if (x < halfWidth && y < halfHeight) {
        if (isWalking) {
            window.reducer('BRAKE_LEFT');
        }
    } 
    // Als de vinger wordt opgetild uit de RECHTSBOVEN zone (walk right)
    else if (x >= halfWidth && y < halfHeight) {
        if (isWalking) {
            window.reducer('BRAKE_RIGHT');
        }
    }
    
    // Andere acties (JUMP, FIREBALL) hebben geen 'BRAKE' nodig.
    isWalking = false; // Reset de status, want de vinger is opgetild.
}


// Koppel de listeners aan het HELE venster
window.addEventListener('touchstart', handleTouchStart, { passive: false });
window.addEventListener('touchend', handleTouchEnd, { passive: false });
window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
console.log("Touchscreen zones gekoppeld: De hele game is nu de controller.");
