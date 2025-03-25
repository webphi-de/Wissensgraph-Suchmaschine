/* // Daten laden
fetch('graph_data.json')
  .then(response => response.json())
  .then(data => {

    const Graph = ForceGraph3D()(document.getElementById('3d-graph'))// 3D-Graph initialisieren
      .graphData(data)
      // Stabilisierung
      .d3AlphaDecay(0.1)          // Schnelleres Stoppen der Simulation (Standard: 0.0228)
      .d3VelocityDecay(0.4)       // Höhere Dämpfung = weniger "Nachschwingen" (Standard: 0.4)
      .cooldownTime(0)            // Simulation sofort starten/stoppen
      .warmupTicks(200)           // Mehr Vorab-Berechnungen
      // Kraftstärken anpassen
      .d3Force('charge', () => d3.forceManyBody().strength(-30))  // Weniger starke Abstoßung
      .d3Force('link', () => d3.forceLink().distance(100))        // Festere Kantenlänge
      .nodeLabel(node => node.name)
      .linkWidth(link => link.value * 2) // Kantenstärke dynamisch (value 0.5-1.5 → 1-3px)
      .linkColor(link => `rgba(255, ${255 - (link.value * 85)}, 0, 0.8)`)
      .linkWidth(link => link.value * 2)  // Kantenstärke
      .linkColor(link => `rgba(255, ${255 - (link.value * 85)}, 0, 0.8)`); // Farbe

    // main.js (angepasst)
    Graph.nodeThreeObject(node => {

      // (A) Kugel als Knoten erstellen
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5),  // Radius anpassen (z. B. 5)
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 })
      );

      // (B) Text-Sprite erstellen (weißer Hintergrund, schwarzer Text)
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(createTextCanvas(node.name)),
          transparent: true,
          depthTest: false
        })
      );
      // Sprite-Skalierung:
      sprite.scale.set(40, 20, 1); // Breite, Höhe, Tiefe
      sprite.position.set(0, 10, 0); // Text über der Kugel positionieren

      // (C) Gruppe aus Kugel + Text erstellen
      const group = new THREE.Group();
      group.add(sphere);
      group.add(sprite);

      return group;
    });
  });


// Hilfsfunktion für Text-Canvas
function createTextCanvas(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '14px Arial';

  // Hintergrund
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 200, 50); // Fläche größer als Text

  // Text
  ctx.fillStyle = 'white';
  ctx.fillText(text, 10, 20);

  // // Canvas-Größe in createTextCanvas:
  // canvas.width = 200;
  // canvas.height = 50;

  return canvas;
}
 */
// main.js (Testversion)

// main.js
fetch('graph_data.json')
  .then(response => response.json())
  .then(data => {

    const Graph = ForceGraph3D()(document.getElementById('3d-graph'))// 3D-Graph initialisieren
      .graphData(data)
      .warmupTicks(200)
      // .d3AlphaDecay(0.01) // Langsamere Simulation
      // .d3VelocityDecay(0.1)
      // .linkDistance(100) // Allgemeine Link-Distanz
      // .linkStrength(0.5) // Flexiblere Kanten
      // .d3Force('charge', -30); // Gleichmäßige Abstoßung
      .d3AlphaDecay(0.05)
      .d3VelocityDecay(0.2)
      // .numDimensions(3) // Erzwinge 3D-Simulation
       .forceEngine('d3') // Oder 'ngraph' testen
      .cooldownTime(Infinity) // Simulation läuft kontinuierlich
      .linkWidth(link => link.value * 3) // Dickere Kanten
      .linkColor(link => {
        const heat = Math.min(link.value * 0.8, 1); // Wert → 0-1 skalieren
        return `hsl(${30 * (1 - heat)}, 100%, 50%)`; // Rot (hoher Wert) → Gelb (niedrig)
      });

    Graph.nodeThreeObject(node => {
      // (A) Knoten-Kugel
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(5),
        new THREE.MeshBasicMaterial({ color: 0x1f78b4 }) // Blau statt Grün
      );

      // (B) Text-Sprite mit Hintergrund
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(createTextCanvas(node.name)),
          transparent: true,
          depthTest: false
        })
      );
      sprite.scale.set(50, 25, 1);
      sprite.position.set(0, 10, 0); // Text über der Kugel

      // (C) Kombiniere beides
      const group = new THREE.Group();
      group.add(sphere);
      group.add(sprite);
      return group;
    });

    Graph.onNodeClick(async node => {
      const sidebar = document.getElementById('sidebar');
      try {
        const res = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${node.id}.json`);
        const data = await res.json();
        const entity = data.entities[node.id];

        // Titel
        document.getElementById('node-title').textContent =
          entity.labels.de?.value || entity.labels.en?.value || node.name;

        // Beschreibung
        document.getElementById('node-description').textContent =
          entity.descriptions.de?.value || entity.descriptions.en?.value || "Keine Beschreibung.";

        // Bild (falls vorhanden)
        const imageClaim = entity.claims.P18?.[0]?.mainsnak?.datavalue?.value;
        if (imageClaim) {
          document.getElementById('node-image').src =
            `https://commons.wikimedia.org/wiki/Special:FilePath/${imageClaim}?width=300`;
        }

        // Wikidata-Link
        document.getElementById('wiki-link').href =
          `https://www.wikidata.org/wiki/${node.id}`;

        sidebar.style.display = 'block';
      } catch (err) {
        console.error('Fehler beim Laden der Wikidata:', err);
      }
    });

  });

// Hilfsfunktion für Labels
function createTextCanvas(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '14px Arial';

  // Hintergrund
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ctx.measureText(text).width + 20, 30);

  // Text
  ctx.fillStyle = 'black';
  ctx.fillText(text, 10, 20);
  return canvas;
}