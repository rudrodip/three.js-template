import * as THREE from 'three';
import { OrbitControls } from "three-full/sources/controls/OrbitControls";

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
  u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
}

// Create a cube
const planeGeometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertex-shader")!.textContent!,
  fragmentShader: document.getElementById("fragment-shader")!.textContent!,
  side: THREE.DoubleSide,
  // wireframe: true,
  uniforms,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.y = Math.PI / 2;

scene.add(plane);

function animate() {
  uniforms.u_time.value += 0.05;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
})

window.addEventListener('mousemove', (e) => {
  uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight);
});
