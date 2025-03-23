const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();



renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Graph-Daten laden
fetch('graph_data.json').then(response => response.json()).then(data => {

  const nodeValues = calculateNodeValues(data);
  // Größe basierend auf Vernetzungsgrad
  const sizeScale = (degree) => 0.1 + degree * 0.02; // Experimentiere mit diesen Werten!

  // Berechne Vernetzungsgrad
  const nodeDegree = {};
  data.links.forEach(link => {
    nodeDegree[link.source] = (nodeDegree[link.source] || 0) + 1;
    nodeDegree[link.target] = (nodeDegree[link.target] || 0) + 1;
  });


  // Knoten erstellen
  data.nodes.forEach(node => {
    const degree = nodeDegree[node.id] || 0;
const geometry = new THREE.SphereGeometry(sizeScale(degree), 16, 16);
    const color = colorScale(nodeValues[node.id]); // Farbwert berechnen
    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
    sphere.userData = { id: node.id }; // 🔴 WICHTIG: Metadata setzen
    scene.add(sphere);
  });

  // Kanten erstellen
  data.links.forEach(link => {
    const sourceNode = scene.children.find(n => n.userData?.id === link.source);
    const targetNode = scene.children.find(n => n.userData?.id === link.target);

    if (sourceNode && targetNode) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3().copy(sourceNode.position),
        new THREE.Vector3().copy(targetNode.position)
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000, // Rote Linien (gut sichtbar)
        linewidth: 2
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }
  });
});

camera.position.z = 15;

// Animationsschleife OHNE Testkugel-Rotation
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera); // Nur rendern, keine Rotation
}

// In app.js nach dem Renderer
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Sanfte Bewegung
controls.dampingFactor = 0.05;
animate();

// Hilfsfunktion: Berechne den durchschnittlichen Kantenwert pro Knoten
function calculateNodeValues(data) {
  const nodeValues = {};
  data.nodes.forEach(node => {
    const connectedLinks = data.links.filter(l => l.source === node.id || l.target === node.id);
    nodeValues[node.id] = connectedLinks.length > 0
      ? d3.mean(connectedLinks, l => l.value)
      : 0;
  });
  return nodeValues;
}

// Farbskala (grün → rot)
const colorScale = (value) => {
  const minVal = 0.5, maxVal = 1.5; // Anpassen an deine Daten
  const t = (value - minVal) / (maxVal - minVal);
  return new THREE.Color().setHSL(t * 0.4, 1, 0.5); // HSL für lebendige Farben
};