import { THREE } from "../vendor/three-context.js";

export class HoverController {
    constructor({ camera, canvas, sceneController }) {
        this.camera = camera;
        this.canvas = canvas;
        this.sceneController = sceneController;
        this.raycaster = new THREE.Raycaster();
    }

    update(pointer) {
        const hoveredHandle = this.findHoveredHandle(pointer);
        this.sceneController.resetHandleVisuals();

        if (!hoveredHandle) {
            this.canvas.style.cursor = "default";
            return;
        }

        this.sceneController.activateHandle(hoveredHandle.userData.type, 1.2);
        this.canvas.style.cursor = "grab";
    }

    clear() {
        this.sceneController.resetHandleVisuals();
        this.canvas.style.cursor = "default";
    }

    findHoveredHandle(pointer) {
        this.raycaster.setFromCamera(pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.sceneController.getInteractiveHandles());
        return intersections[0]?.object ?? null;
    }
}
