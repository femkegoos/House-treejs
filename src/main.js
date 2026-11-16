import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {Pane} from 'tweakpane';
import moonTextureUrl from '../textures/texture_moon.jpg';
import whiteBricksTextureUrl from '../textures/texture_white_bricks.jpg';
import starTextureUrl from '../textures/texture_star.png';
import doorTextureUrl from '../textures/texture_door.jpg';
import windowTextureUrl from '../textures/texture_window.png';
import windowReflectionTextureUrl from '../textures/texture_window_reflection.jpg';
import roofTextureUrl from '../textures/texture_roof.jpg';
import garageTextureUrl from '../textures/texture_garage.jpg';
//register scroll trigger plugin
gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
//enable shadows for rendering on vercel
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
ballMaterial.map = new THREE.TextureLoader().load( moonTextureUrl );
const ballGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
ball.position.set( 4, 4, 0 );
//enable shadows for the ball for vercel online
ball.castShadow = true;
ball.receiveShadow = false;
scene.add( ball );

//cube
const geometry = new THREE.BoxGeometry( 3, 2, 3 );
const material = new THREE.MeshToonMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set( 0, 0.5, 0 );
material.map = new THREE.TextureLoader().load( whiteBricksTextureUrl );
cube.castShadow = true;
cube.receiveShadow = false;
scene.add( cube );

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry( 30, 30 ),
  new THREE.MeshToonMaterial( { color: 0x8fa0b5 } )
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add( ground );

//put conegeometry on the cube as a roof with red color
const roofGeometry = new THREE.ConeGeometry( 2, 1, 4 );
const roofMaterial = new THREE.MeshToonMaterial( { color: 0xffffff } );
const roof = new THREE.Mesh( roofGeometry, roofMaterial );
roof.position.set( 0, 1.5, 0 );
//put texture map on the roof with roof texture
roofMaterial.map = new THREE.TextureLoader().load( roofTextureUrl );
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
roof.receiveShadow = false;
cube.add( roof );


//put a window with texture on the cube
const windowGeometry = new THREE.PlaneGeometry( 0.5, 0.5 );
const windowMaterial = new THREE.MeshToonMaterial( {
    color: 0xffffff,
    transparent: true,
    alphaTest: 0.01,
    depthWrite: false,
} );
//put window border texture on the window with map material
windowMaterial.map = new THREE.TextureLoader().load( windowTextureUrl );
const windowMesh = new THREE.Mesh( windowGeometry, windowMaterial );
windowMesh.position.set( -0.9, 0.4, 1.52 );
windowMesh.castShadow = true;
windowMesh.receiveShadow = true;
cube.add( windowMesh );

//put a window with texture on the cube
const planeGeometry = new THREE.PlaneGeometry( 0.4, 0.4 );
const planeMaterial = new THREE.MeshToonMaterial( {
    color: 0xffffff,
} );
//put window reflection texture on the window with map material
planeMaterial.map = new THREE.TextureLoader().load( windowReflectionTextureUrl );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set( -0.9, 0.4, 1.51 );
plane.castShadow = true;
plane.receiveShadow = true;
cube.add( plane );

//put a plane with wood texture on the cube named door
const doorGeometry = new THREE.PlaneGeometry( .6, 1 );
const doorMaterial = new THREE.MeshToonMaterial( {
    color: 0xffffff,
} );
//put wood texture on the door with map material
doorMaterial.map = new THREE.TextureLoader().load( doorTextureUrl );
const door = new THREE.Mesh( doorGeometry, doorMaterial );
door.position.set( 0.8, -0.5, 1.51 );
door.castShadow = true;
door.receiveShadow = true;
cube.add( door );

// Shared settings for the rounded 3D letters on the front of the house.
const nameMaterial = new THREE.MeshToonMaterial( { color: 0xffd700 } );
const letterWidth = 0.22; // Change the width of every letter here.
const letterHeight = 0.36; // Change the height of every letter here.
const letterThickness = 0.07; // Change the thickness of every rounded bar here.
const letterDepth = 0.1; // Change how far the letters come out of the wall here.
const letterY = 0.62; // Change the shared vertical position of the name here.
const frontZ = 1.56; // Change the distance from the front wall here.

// Create one rounded bar. More bevel segments make the edges look smoother.
function addRoundedBar( letterGroup, x, y, width, height, rotation = 0 ) {
  const bar = new THREE.Mesh(
    new RoundedBoxGeometry( width, height, letterDepth, 6, 0.035 ),
    nameMaterial
  );
  bar.position.set( x, y, frontZ ); // Change x/y when moving an individual bar.
  bar.rotation.z = rotation; // Change rotation when changing a diagonal's direction.
  bar.castShadow = true;
  bar.receiveShadow = true;
  letterGroup.add( bar );
}

// Create the letter F from one vertical and two horizontal rounded bars.
function createLetterF( x, y ) {
  const letter = new THREE.Group();
  addRoundedBar( letter, x - letterWidth / 2, y, letterThickness, letterHeight );
  // Keep the top bar within the maximum height of the vertical stem.
  addRoundedBar( letter, x, y + letterHeight / 2 - letterThickness / 2, letterWidth, letterThickness );
  addRoundedBar( letter, x - 0.02, y, letterWidth * 0.75, letterThickness );
  return letter;
}

// Create the letter E from one vertical and three horizontal rounded bars.
function createLetterE( x, y ) {
  const letter = new THREE.Group();
  addRoundedBar( letter, x - letterWidth / 2, y, letterThickness, letterHeight );
  // Keep the top arm within the maximum height of the vertical stem.
  addRoundedBar( letter, x, y + letterHeight / 2 - letterThickness / 2, letterWidth, letterThickness );
  addRoundedBar( letter, x - 0.02, y, letterWidth * 0.75, letterThickness );
  // Keep the bottom arm within the minimum height of the vertical stem.
  addRoundedBar( letter, x, y - letterHeight / 2 + letterThickness / 2, letterWidth, letterThickness );
  return letter;
}

// Create the letter M with two verticals and two diagonal rounded bars.
// The diagonals meet at the bottom, like a normal capital M.
function createLetterM( x, y ) {
  const letter = new THREE.Group();
  const diagonalLength = Math.hypot( letterWidth / 2, letterHeight / 2 );
  const diagonalAngle = Math.atan2( letterWidth / 2, letterHeight / 2 );
  addRoundedBar( letter, x - letterWidth / 2, y, letterThickness, letterHeight );
  addRoundedBar( letter, x + letterWidth / 2, y, letterThickness, letterHeight );
  // Change these x/y offsets to move the two middle legs of the M.
  addRoundedBar( letter, x - 0.055, y - -0.035, letterThickness, diagonalLength, diagonalAngle );
  addRoundedBar( letter, x + 0.055, y - -0.035, letterThickness, diagonalLength, -diagonalAngle );
  return letter;
}

// Create the letter K with one vertical and two diagonal rounded bars.
// The upper and lower arms both point to the right.
function createLetterK( x, y ) {
  const letter = new THREE.Group();
  const diagonalLength = Math.hypot( letterWidth / 2, letterHeight / 2 );
  const diagonalAngle = Math.atan2( letterWidth / 2, letterHeight / 2 );
  addRoundedBar( letter, x - letterWidth / 2, y, letterThickness, letterHeight );
  // Change these x/y offsets to move the two arms of the K.
  addRoundedBar( letter, x + 0, y + 0.09, letterThickness, diagonalLength, -diagonalAngle );
  addRoundedBar( letter, x + 0, y - 0.09, letterThickness, diagonalLength, diagonalAngle );
  return letter;
}

// Add every letter separately so each one can be moved or styled independently.
const name = new THREE.Group();
name.name = 'name';
const letterF = createLetterF( -0.34, letterY ); // Change the first letter's x/y position here.
const letterE1 = createLetterE( -0.05, letterY ); // Change the second letter's x/y position here.
const letterM = createLetterM( 0.24, letterY ); // Change the M's x/y position here.
const letterK = createLetterK( 0.57, letterY ); // Change the K's x/y position here.
const letterE2 = createLetterE( 0.82, letterY ); // Change the last letter's x/y position here.

name.add( letterF );
name.add( letterE1 );
name.add( letterM );
name.add( letterK );
name.add( letterE2 );
name.position.x = 0.2; // Move the complete name left or right here.
name.position.y = -0.1; // Move the complete name up or down here.
cube.add( name );

//add plane with texture of garage door on the cube with the same heght as the door and the double widht of the door
const garageDoorGeometry = new THREE.PlaneGeometry( 1.2, 1 );
const garageDoorMaterial = new THREE.MeshToonMaterial( {
    color: 0xffffff,
} );
//put texture map on the garage door with map material
garageDoorMaterial.map = new THREE.TextureLoader().load( garageTextureUrl );
const garageDoor = new THREE.Mesh( garageDoorGeometry, garageDoorMaterial );
garageDoor.position.set( -2, -0.5, 1.51 );
garageDoor.castShadow = true;
garageDoor.receiveShadow = true;
cube.add( garageDoor );


//ambient light
const ambientLight = new THREE.AmbientLight( 0x400000, 3 );
scene.add( ambientLight );

//directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 3.50, 3.70, 10 );
//set light intensity to 0.5
directionalLight.intensity = 1;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set( 4096, 4096 );
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
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


// Create a stars atmosphere using white point particles
const starsGeometry = new THREE.BufferGeometry();
const starsParticles = 10000;
const starsPositions = new Float32Array( starsParticles * 3 );
for ( let i = 0; i < starsPositions.length; i += 3 ) {
  starsPositions[ i ] = ( Math.random() - 0.5 ) * 20;
  starsPositions[ i + 1 ] = ( Math.random() - 0.5 ) * 20;
  starsPositions[ i + 2 ] = ( Math.random() - 0.5 ) * 20;
}
starsGeometry.setAttribute( 'position', new THREE.BufferAttribute( starsPositions, 3 ) );
//put texture map on the stars particles
const starsMaterial = new THREE.PointsMaterial( {
  color: 0xffffff,
  size: 0.6,
  transparent: true,
  alphaTest: 0.01,
  depthWrite: false,
} );
starsMaterial.map = new THREE.TextureLoader().load( starTextureUrl );
const stars = new THREE.Points( starsGeometry, starsMaterial );
stars.renderOrder = -1;
scene.add( stars );


function animate( time ) {
  //group.position.x = Math.sin( time / 1000 );
  //group.rotation.y = Math.sin( time / 1000 );²
  //let the moon rotate around the cube
  ball.position.x = Math.sin( time / 1000 ) * 4;
  ball.position.z = Math.cos( time / 1000 ) * 4;
  ball.rotation.y = time / 1000;
  controls.update();
  
  renderer.render( scene, camera );


}