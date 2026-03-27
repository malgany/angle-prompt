import { THREE } from "../../vendor/three-context.js";

export function createPlaceholderTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext("2d");
    context.fillStyle = "#3a3a4a";
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = "#ffcc99";
    context.beginPath();
    context.arc(128, 128, 80, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#333";
    context.beginPath();
    context.arc(100, 110, 10, 0, Math.PI * 2);
    context.arc(156, 110, 10, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#333";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(128, 130, 35, 0.2, Math.PI - 0.2);
    context.stroke();

    return new THREE.CanvasTexture(canvas);
}
