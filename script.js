import 'module'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load and display the SVG
const loader = new loader();
loader.load('media/sacrix_master_logo.svg', function (data) {
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

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
