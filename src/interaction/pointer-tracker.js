import { THREE } from "../vendor/three-context.js";

export class PointerTracker {
    constructor(canvas) {
        this.canvas = canvas;
        this.pointer = new THREE.Vector2();
    }

    update(event) {
        const sourceEvent = this.getSourceEvent(event);
        const rect = this.canvas.getBoundingClientRect();

        this.pointer.x = ((sourceEvent.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((sourceEvent.clientY - rect.top) / rect.height) * 2 + 1;

        return this.pointer;
    }

    getSourceEvent(event) {
        if (event.touches && event.touches.length > 0) {
            return event.touches[0];
        }

        return event;
    }
}
