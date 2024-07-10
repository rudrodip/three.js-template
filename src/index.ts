import * as THREE from "three";
import { OrbitControls } from "three-full/sources/controls/OrbitControls";
import Stats from "three/addons/libs/stats.module.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";

import vertexPars from "./shaders/vertex_pars.glsl?raw";
import vertexMain from "./shaders/vertex_main.glsl?raw";
import fragmentPars from './shaders/fragment_pars.glsl?raw'
import fragmentMain from './shaders/fragment_main.glsl?raw'

const canvas = document.getElementById("webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  samples: 8,
})

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 0, 0);

// Add composer
const composer = new EffectComposer(renderer, target);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Add light
// lighting
const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
dirLight.position.set(2, 2, 2)

const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
scene.add(dirLight, ambientLight)


// Add icosahedron
const geometry = new THREE.IcosahedronGeometry(1, 200);
const material = new THREE.MeshStandardMaterial({
  // @ts-ignore
  onBeforeCompile: (shader) => {
    // storing a reference to shader object
    material.userData.shader = shader;
    
    shader.uniforms.u_time = { value: 0 };

    // #include <defaultnormal_vertex>

    const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`;
    shader.vertexShader = shader.vertexShader.replace(
      parsVertexString,
      parsVertexString + vertexPars
    );

    const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`;
    shader.vertexShader = shader.vertexShader.replace(
      mainVertexString,
      mainVertexString + vertexMain
    );

    const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
      const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
      shader.fragmentShader = shader.fragmentShader.replace(
        parsFragmentString,
        parsFragmentString + fragmentPars
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        mainFragmentString,
        mainFragmentString + fragmentMain
      )
  },
});
const ico = new THREE.Mesh(geometry, material);
scene.add(ico);

// Animate
const clock = new THREE.Clock();
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.4, 0.4))
function animate() {
  controls.update();
  composer.render();
  material.userData.shader.uniforms.u_time.value = clock.getElapsedTime();

  stats.update();
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
