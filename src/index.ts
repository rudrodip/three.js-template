import * as THREE from 'three-full';
import { OrbitControls } from "three-full/sources/controls/OrbitControls";

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2, 3, 3);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/earth-day-map.jpg');

// Create a cube
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ map: texture });
const planet = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);

scene.add(planet);
scene.add(light);

function animate() {
  planet.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);