import * as THREE from 'three';
import { OrbitControls } from "three-full/sources/controls/OrbitControls";
import Stats from 'three/addons/libs/stats.module.js';

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 0, 0);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio) },
  u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
}

// Create a cube
const geometry = new THREE.IcosahedronGeometry(20, 5);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  wireframe: true,
  uniforms,
})
const ico = new THREE.Mesh(geometry, material);
scene.add(ico);

ico.rotation.x -= 0.2;
function animate() {
  stats.begin();
  uniforms.u_time.value += 0.05;
  controls.update();
  ico.rotation.y += 0.01;

  renderer.render(scene, camera);
  stats.end();
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
