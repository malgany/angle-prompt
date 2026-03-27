import { THREE } from "../vendor/three-context.js";
import { createSceneObjects } from "./factories/scene-objects-factory.js";

export function createSceneRuntime({ config, wrapperElement, overlayElement }) {
    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer(wrapperElement, overlayElement);
    const sceneObjects = createSceneObjects(config);

    addEnvironment(scene);
    addSceneObjects(scene, sceneObjects.nodes);

    return {
        scene,
        camera,
        renderer,
        sceneObjects
    };
}

function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    return scene;
}

function createCamera() {
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4.5, 3, 4.5);
    camera.lookAt(0, 0.75, 0);
    return camera;
}

function createRenderer(wrapperElement, overlayElement) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrapperElement.insertBefore(renderer.domElement, overlayElement);
    return renderer;
}

function addEnvironment(scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    scene.add(new THREE.GridHelper(8, 16, 0x333333, 0x222222));
}

function addSceneObjects(scene, nodes) {
    nodes.forEach((node) => {
        scene.add(node);
    });
}
