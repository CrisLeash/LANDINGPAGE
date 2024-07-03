import * as THREE from 'https://threejs.org/build/three.module.js';
import { SVGLoader } from 'https://threejs.org/examples/jsm/loaders/SVGLoader.js';

// Cursor style for nace Link span hover
document.getElementById('nace_Link').addEventListener('click', function() {
    window.open('https://www.instagram.com/nace.grg/', '_blank');
});
document.getElementById('nace_Link').addEventListener('mouseover', function() {
    this.style.cursor = 'pointer';
});
document.getElementById('nace_Link').addEventListener('mouseout', function() {
    this.style.cursor = 'auto';
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Camera settings
camera.position.set(5, 5, 5); // Corrected camera position setting

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load and display the SVG
const loader = new SVGLoader(); // Corrected SVGLoader instantiation
loader.load(newFunction(), function (data) {
    const paths = data.paths;
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const shapes = path.toShapes(true);
        for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            const geometry = new THREE.ShapeBufferGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }
    }
});

function newFunction() {
    return '/media/sacrix_master_logo.svg';
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
