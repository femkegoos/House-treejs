import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {Pane} from 'tweakpane';

//register scroll trigger plugin
gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


//ball
const ballMaterial = new THREE.MeshToonMaterial( {
    color: 0xffffff,
} );
//put material map texture on the ball
ballMaterial.map = new THREE.TextureLoader().load( '../textures/texture_moon.jpg' );
const ballGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
ball.position.set( 4, 4, 0 );
scene.add( ball );

//cube
const geometry = new THREE.BoxGeometry( 3, 2, 3 );
const material = new THREE.MeshToonMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, 0.5, 0 );
material.map = new THREE.TextureLoader().load( '../textures/texture_white_bricks.jpg' );
scene.add( cube );

//put a plane with transparent texture on the cube
const planeGeometry = new THREE.PlaneGeometry( 1, .5 );
const planeMaterial = new THREE.MeshToonMaterial( {
    color: 0xfffff,
    transparent: true,
    opacity: 0.8
} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set( -0.3, 0.3, 1.51 );
cube.add( plane );

//Border of the window with edgesgeometry
const edges = new THREE.EdgesGeometry( planeGeometry );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000} );
const line = new THREE.LineSegments( edges, lineMaterial );
line.position.set( -0.3, 0.3, 1.51 );
cube.add( line );

//put a plane with black color on the cube named door
const doorGeometry = new THREE.PlaneGeometry( .5, 1 );
const doorMaterial = new THREE.MeshToonMaterial( {
    color: 0x00000,
    transparent: true,
    opacity: 0.8
} );
const door = new THREE.Mesh( doorGeometry, doorMaterial );
door.position.set( 0.5, -0.5, 1.01 );
cube.add( door );



//ambient light
const ambientLight = new THREE.AmbientLight( 0x400000, 3 );
scene.add( ambientLight );

//directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 3.50, 3.70, 10 );
//set light intensity to 0.5
directionalLight.intensity = 2;
scene.add( directionalLight );

//directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 1 );
scene.add( directionalLightHelper );


camera.position.z = 10;


//sliders toevoegen voor directional light
const pane = new Pane();
const directionalLightFolder = pane.addFolder({ title: 'Directional Light' });
directionalLightFolder.addBinding(directionalLight, 'intensity', { min: 0, max: 5 });
directionalLightFolder.addBinding(directionalLight.position, 'x', { min: -10, max: 10 });
directionalLightFolder.addBinding(directionalLight.position, 'y', { min: -10, max: 10 });
directionalLightFolder.addBinding(directionalLight.position, 'z', { min: -10, max: 10 });


// Create a snowy atmosphere using white point particles
const snowGeometry = new THREE.BufferGeometry();
const snowParticles = 5000;
const snowPositions = new Float32Array( snowParticles * 1 );
for ( let i = 0; i < snowPositions.length; i += 1 ) {
  snowPositions[ i ] = ( Math.random() - 0.5 ) * 20;
  snowPositions[ i + 1 ] = ( Math.random() - 0.5 ) * 20;
  snowPositions[ i + 2 ] = ( Math.random() - 0.5 ) * 20;
}
snowGeometry.setAttribute( 'position', new THREE.BufferAttribute( snowPositions, 3 ) );
const snowMaterial = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );
const snow = new THREE.Points( snowGeometry, snowMaterial );
scene.add( snow );


function animate( time ) {
  //group.position.x = Math.sin( time / 1000 );
  //group.rotation.y = Math.sin( time / 1000 );
  renderer.render( scene, camera );


}