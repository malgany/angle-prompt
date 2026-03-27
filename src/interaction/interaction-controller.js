import { THREE } from "../vendor/three-context.js";

export class InteractionController {
    constructor({
        camera,
        canvas,
        cameraState,
        sceneController,
        pointerTracker,
        dragStateUpdater,
        hoverController,
        snapAnimator,
        onStateChange
    }) {
        this.camera = camera;
        this.canvas = canvas;
        this.cameraState = cameraState;
        this.sceneController = sceneController;
        this.pointerTracker = pointerTracker;
        this.dragStateUpdater = dragStateUpdater;
        this.hoverController = hoverController;
        this.snapAnimator = snapAnimator;
        this.onStateChange = onStateChange;
        this.raycaster = new THREE.Raycaster();
        this.dragSession = null;

        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
    }

    attach() {
        this.canvas.addEventListener("mousedown", this.handlePointerDown);
        this.canvas.addEventListener("mousemove", this.handlePointerMove);
        window.addEventListener("mouseup", this.handlePointerUp);

        this.canvas.addEventListener("touchstart", this.handlePointerDown, { passive: false });
        this.canvas.addEventListener("touchmove", this.handlePointerMove, { passive: false });
        window.addEventListener("touchend", this.handlePointerUp);
    }

    handlePointerDown(event) {
        if (event.target !== this.canvas) {
            return;
        }

        this.snapAnimator.cancel();

        const pointer = this.pointerTracker.update(event);
        const handle = this.pickHandle(pointer);

        if (!handle) {
            return;
        }

        this.startDrag(handle.userData.type, pointer);
        event.preventDefault();
    }

    handlePointerMove(event) {
        const pointer = this.pointerTracker.update(event);

        if (!this.dragSession) {
            this.hoverController.update(pointer);
            return;
        }

        this.dragStateUpdater.update(this.dragSession, pointer);
        this.onStateChange();
        event.preventDefault();
    }

    handlePointerUp() {
        if (!this.dragSession) {
            return;
        }

        this.sceneController.deactivateHandle(this.dragSession.type);
        this.snapAnimator.start();
        this.finishDrag();
    }

    pickHandle(pointer) {
        this.raycaster.setFromCamera(pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.sceneController.getInteractiveHandles());
        return intersections[0]?.object ?? null;
    }

    startDrag(type, pointer) {
        this.dragSession = {
            type,
            startPointer: pointer.clone(),
            startDistanceFactor: this.cameraState.getRaw().distanceFactor
        };

        this.hoverController.clear();
        this.sceneController.activateHandle(type, 1.3);
        this.canvas.style.cursor = "grabbing";
    }

    finishDrag() {
        this.dragSession = null;
        this.canvas.style.cursor = "default";
    }
}
