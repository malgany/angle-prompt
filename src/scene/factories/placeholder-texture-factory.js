import { THREE } from "../../vendor/three-context.js";

export function createPlaceholderTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);

    paintLoadingState(context, canvas);
    loadReferenceImage(context, canvas, texture);

    return texture;
}

function loadReferenceImage(context, canvas, texture) {
    const image = new Image();

    image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        texture.needsUpdate = true;
    };
    image.onerror = () => {
        paintLoadingState(context, canvas);
        texture.needsUpdate = true;
    };
    image.src = new URL("../../../assets/images/reference-image.png", import.meta.url).href;
}

function paintLoadingState(context, canvas) {
    context.fillStyle = "#dde4f2";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#5b7482";
    context.lineWidth = 18;
    context.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
}
