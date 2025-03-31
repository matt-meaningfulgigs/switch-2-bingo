const rumors: string[] = [
    "Enhanced versions of existing games",
    "Backward compatibility (mostly)",
    "Virtual game card lending (lol okay)",
    "New Mario Kart at launch (again)",
    "8-inch LCD (still 720p)",
    "4K DLSS (not native)",
    "Magnetic Joy-Cons (still drift)",
    "Extra USB-C (you’ll never use it)",
    "U-shaped kickstand (now sturdy?)",
    "Optical sensors (sure, whatever)",
    "Launches June 2025 (doubt it)",
    "$349 base (plus pain)",
    "Nintendo Online ‘upgrade’",
    "AI visuals (hallucinations)",
    "Better audio (barely)",
    "128GB storage (1.5 games)",
    "Longer battery (turn screen off)",
    "Cooling fan in dock (lol)",
    "Color variants (scalper exclusive)",
    "Online multiplayer (still P2P)",
    "TOTK re-release (again)",
    "Animal Crossing upgrade (more debt)",
    "White model (boring)",
    "Drift fixed (they swear)",
    "Amiibo support (still pointless)",
    "Metroid Prime 4 (launch lie)",
    "120Hz screen, 15fps games",
    "HDR (for washed-out pixels)",
    "New 'C' button (unmapped)",
    "Dual screen (for a single game)",
    "eShop overhaul (still slow)",
    "Virtual Console returns (but bad)",
    "Haptics 2.0 (now buzzier)",
    "Voice assistant (only says 'Hmm...')",
    "Cloud gaming (buffering...)",
    "AR mode (no support)",
    "Parental controls (lock the sadness)",
    "Amiibo 2.0 (why?)",
    "Custom UI themes (two choices)",
    "Social sharing (why?)",
    "Eco mode (2fps)",
    "Bluetooth ‘improved’",
    "Region-free (finally)",
    "Better motion controls (Wii flashbacks)",
    "4K screen, 540p actual",
    "15fps max performance",
    "Looks worse than a 3GS",
    "Games for men who think they’re anime teens",
    "Massive box, tiny fan",
    "Online required for carts",
    "Plastic screen (again)",
    "A single tear rolls down your cheek",
    "Pre-installed shovelware",
    "Voice chat locked behind app",
    "Pro Controller sold separately (again)",
    "No included charger",
    "Still using friend codes",
    "UI lags out of the box",
    "Tears of the Kingdom runs worse",
    "Day one patch: 12GB",
    "Box art looks AI-generated",
    "3rd party devs already giving up",
    "Mario speaks full English now (haunting)",
    "3-hour battery on 'Performance Mode'",
    "Cartridge slot moved to bottom",
    "USB-C cable not included",
    "Joy-Cons only sold in pink & teal",
    "Nintendo says 'This is for the fans'",
    "Preorders start April 9th (bots get them all)",
    "Runs Pokémon at 12fps"
  ];  

function shuffle(array: string[], seed: number): string[] {
  const rng = mulberry32(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function mulberry32(a: number): () => number {
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getSeedFromURL(): number | null {
  const urlParams = new URLSearchParams(window.location.search);
  const seedParam = urlParams.get("seed");
  return seedParam ? parseInt(seedParam) : null;
}

function getSelectedIndexesFromURL(): number[] {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedParam = urlParams.get("selected");
  return selectedParam
    ? selectedParam.split(",").map(Number).filter(n => !isNaN(n))
    : [];
}

function updateSelectedInURL(seed: number): void {
    const selected: number[] = [];
    const cells = document.querySelectorAll(".card-cell");
    cells.forEach((cell, index) => {
      if (cell.classList.contains("selected")) {
        selected.push(index);
      }
    });
  
    const shareURL = `${window.location.origin}${window.location.pathname}?seed=${seed}&selected=${selected.join(",")}`;
    window.history.replaceState({}, "", shareURL);
  
    const shareButton = document.getElementById("copy-button") as HTMLButtonElement;
    shareButton.dataset.url = shareURL;
  }
  

function createBingo(seed: number, selectedIndexes: number[] = []): void {
  const cardContainer = document.getElementById("bingo-card")!;
  const messageEl = document.getElementById("bingo-message")!;
  cardContainer.innerHTML = "";
  messageEl.style.display = "none";

  const shuffled = shuffle(rumors, seed);
  const selectedItems = shuffled.slice(0, 25);

  selectedItems.forEach((text, index) => {
    const cell = document.createElement("div");
    const row = Math.floor(index / 5);
    const col = index % 5;
    const diagonal = row + col;
    const normalized = Math.round((diagonal / 8) * 5); // Map 0–8 → 0–5
    cell.className = `card-cell rainbow-${normalized}`;
    cell.textContent = text;
    cell.dataset.index = index.toString();
  
    if (selectedIndexes.includes(index)) {
      cell.classList.add("selected");
    }
  
    cell.addEventListener("click", () => {
      cell.classList.toggle("selected");
      updateSelectedInURL(seed);
      checkForBingo();
    });
  
    cardContainer.appendChild(cell);
  });
  

  checkForBingo();
  updateSelectedInURL(seed);
}

function checkForBingo(): void {
  const cells = Array.from(document.querySelectorAll(".card-cell"));
  const selected = cells.map(cell => cell.classList.contains("selected"));

  const winLines = [
    [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14],
    [15,16,17,18,19], [20,21,22,23,24],
    [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22],
    [3,8,13,18,23], [4,9,14,19,24],
    [0,6,12,18,24], [4,8,12,16,20]
  ];

  const isBingo = winLines.some(line => line.every(i => selected[i]));
  const messageEl = document.getElementById("bingo-message")!;
  messageEl.style.display = isBingo ? "block" : "none";
  if (isBingo) {
    messageEl.style.display = "block";
    shootPaintSplats(); // 🎨 SPLAT TIME
  } else {
    messageEl.style.display = "none";
  }
  
}

function generateNewSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

document.getElementById("generate")?.addEventListener("click", () => {
  const newSeed = generateNewSeed();
  window.location.href = `?seed=${newSeed}`;
});

const seed = getSeedFromURL() ?? generateNewSeed();
const selected = getSelectedIndexesFromURL();
createBingo(seed, selected);

document.getElementById("copy-button")?.addEventListener("click", () => {
    const button = document.getElementById("copy-button") as HTMLButtonElement;
    const url = button.dataset.url || window.location.href;
  
    navigator.clipboard.writeText(url).then(() => {
      const confirmEl = document.getElementById("copy-confirm");
      if (confirmEl) {
        confirmEl.style.opacity = "1";
        setTimeout(() => {
          confirmEl.style.opacity = "0";
        }, 1500);
      }
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  });
  
  function shootPaintSplats(): void {
    const container = document.getElementById("paint-container")!;
    const hero = document.getElementById("paint-hero")!;
    const focusedSplatsPerBurst = 180;
    const radialSplatsPerBurst = 50;
    const burstInterval = 400;
  
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
  
    const center = { x: screenW / 2, y: screenH / 2 };
  
    // Target zones halfway between center and screen corners
    const targetPoints = [
      { x: (center.x + 0) / 2, y: (center.y + 0) / 2 },                   // Top-left
      { x: (center.x + screenW) / 2, y: (center.y + 0) / 2 },            // Top-right
      { x: center.x, y: center.y },                                      // Center
      { x: (center.x + 0) / 2, y: (center.y + screenH) / 2 },           // Bottom-left
      { x: (center.x + screenW) / 2, y: (center.y + screenH) / 2 },     // Bottom-right
    ];
  
    // Shuffle target order
    for (let i = targetPoints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetPoints[i], targetPoints[j]] = [targetPoints[j], targetPoints[i]];
    }
  
    const originWobble = 60;
  
    // 🎥 Zoom in hero
    hero.classList.add("showing");
  
    targetPoints.forEach((target, b) => {
      setTimeout(() => {
        // 🎯 Focused blast toward target
        for (let i = 0; i < focusedSplatsPerBurst; i++) {
          const originX = center.x + (Math.random() * originWobble - originWobble / 2);
          const originY = center.y + (Math.random() * originWobble - originWobble / 2);
  
          const tx = target.x + (Math.random() * 800 - 400); // splash range at impact
          const ty = target.y + (Math.random() * 800 - 400);
  
          const dx = tx - originX;
          const dy = ty - originY;
  
          const size = 8 + Math.random() * 24;
          const flightDelay = 100 + Math.random() * 400;
  
          const bullet = document.createElement("div");
          bullet.className = "paint-bullet";
          bullet.style.width = `${size}px`;
          bullet.style.height = `${size}px`;
          bullet.style.left = `${originX}px`;
          bullet.style.top = `${originY}px`;
          bullet.style.setProperty("--dx", `${dx}px`);
          bullet.style.setProperty("--dy", `${dy}px`);
          container.appendChild(bullet);
  
          setTimeout(() => {
            bullet.remove();
  
            const glob = document.createElement("div");
            glob.className = "paint-splatter";
            glob.style.left = `${originX + dx}px`;
            glob.style.top = `${originY + dy}px`;
            glob.style.width = `${size}px`;
            glob.style.height = `${size}px`;
            container.appendChild(glob);
  
            const trail = document.createElement("div");
            trail.className = "paint-trail";
            trail.style.left = `${originX + dx + size / 2 - 1}px`;
            trail.style.top = `${originY + dy + size}px`;
            container.appendChild(trail);
  
            setTimeout(() => {
              glob.remove();
              trail.remove();
            }, 4000);
          }, flightDelay);
        }
  
        // 🌟 Little radial spray at origin (like backpressure spray from the blaster)
        for (let i = 0; i < radialSplatsPerBurst; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 120;
  
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
  
          const size = 4 + Math.random() * 10;
          const originX = center.x;
          const originY = center.y;
  
          const splat = document.createElement("div");
          splat.className = "paint-splatter";
          splat.style.left = `${originX + dx}px`;
          splat.style.top = `${originY + dy}px`;
          splat.style.width = `${size}px`;
          splat.style.height = `${size}px`;
          container.appendChild(splat);
  
          const trail = document.createElement("div");
          trail.className = "paint-trail";
          trail.style.left = `${originX + dx + size / 2 - 1}px`;
          trail.style.top = `${originY + dy + size}px`;
          container.appendChild(trail);
  
          setTimeout(() => {
            splat.remove();
            trail.remove();
          }, 3000);
        }
  
        // 🎬 Remove hero after final burst
        if (b === targetPoints.length - 1) {
          setTimeout(() => {
            hero.classList.remove("showing");
          }, 1200); // Let the last burst play out before fading
        }
      }, b * burstInterval);
    });
  }
  