// 3D-Szene initialisieren
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Testknoten (grüne Kugel)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Kamera positionieren
camera.position.z = 5;

// Animation
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();