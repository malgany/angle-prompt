import { SnapAnimator } from "../animation/snap-animator.js";
import { buildPrompt } from "../prompt/build-prompt.js";
import { applyResponsiveCamera } from "../scene/responsive-camera.js";
import { createSceneRuntime } from "../scene/scene-bootstrap.js";
import { HandleVisualController } from "../scene/handle-visual-controller.js";
import { SceneController } from "../scene/scene-controller.js";
import { ClipboardService } from "../services/clipboard-service.js";
import { CameraState } from "../state/camera-state.js";
import { DragStateUpdater } from "../interaction/drag-state-updater.js";
import { HoverController } from "../interaction/hover-controller.js";
import { InteractionController } from "../interaction/interaction-controller.js";
import { PointerTracker } from "../interaction/pointer-tracker.js";
import { DistanceControlsController } from "../ui/distance-controls-controller.js";
import { OverlayController } from "../ui/overlay-controller.js";
import { ToastController } from "../ui/toast-controller.js";

export class App {
    constructor(config) {
        this.config = config;
        this.renderAppState = this.renderAppState.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.animate = this.animate.bind(this);
    }

    init() {
        const dom = this.getDomElements();
        const cameraState = new CameraState(this.config, {
            azimuth: 0,
            elevation: 0,
            distanceFactor: 1.0
        });
        const sceneRuntime = createSceneRuntime({
            config: this.config,
            wrapperElement: dom.wrapperElement,
            overlayElement: dom.sceneUiLayerElement
        });
        const sceneController = this.createSceneController(sceneRuntime.sceneObjects);
        const overlayController = this.createOverlayController(dom);
        const distanceControlsController = this.createDistanceControlsController({
            cameraState,
            dom
        });
        const interactionController = this.createInteractionController({
            cameraState,
            sceneController,
            sceneRuntime
        });

        this.cameraState = cameraState;
        this.sceneRuntime = sceneRuntime;
        this.sceneController = sceneController;
        this.overlayController = overlayController;
        this.distanceControlsController = distanceControlsController;
        this.interactionController = interactionController;

        this.overlayController.attachCopy();
        this.overlayController.attachPanelToggle();
        this.overlayController.attachDetailToggle(this.renderAppState);
        this.distanceControlsController.attach();
        this.interactionController.attach();
        this.renderAppState();
        window.addEventListener("resize", this.handleResize);
        this.animate();
    }

    getDomElements() {
        return {
            wrapperElement: document.getElementById("camera-control-wrapper"),
            sceneUiLayerElement: document.getElementById("scene-ui-layer"),
            promptOverlayElement: document.getElementById("prompt-overlay"),
            promptToggleButtonElement: document.getElementById("prompt-toggle-button"),
            copyButtonElement: document.getElementById("prompt-copy-button"),
            detailToggleElement: document.getElementById("prompt-detail-toggle"),
            promptTextElement: document.getElementById("prompt-text"),
            toastElement: document.getElementById("toast"),
            distanceButtonElements: Array.from(document.querySelectorAll("[data-distance-factor]"))
        };
    }

    createSceneController(sceneObjects) {
        const handleVisualController = new HandleVisualController({
            azimuth: sceneObjects.azimuthHandle,
            elevation: sceneObjects.elevationHandle
        });

        return new SceneController({
            config: this.config,
            sceneObjects,
            handleVisualController
        });
    }

    createOverlayController(dom) {
        return new OverlayController({
            panelElement: dom.promptOverlayElement,
            toggleButtonElement: dom.promptToggleButtonElement,
            copyButtonElement: dom.copyButtonElement,
            detailToggleElement: dom.detailToggleElement,
            textElement: dom.promptTextElement,
            clipboardService: new ClipboardService(),
            toastController: new ToastController(dom.toastElement)
        });
    }

    createDistanceControlsController({ cameraState, dom }) {
        return new DistanceControlsController({
            buttonElements: dom.distanceButtonElements,
            onSelectDistance: (distanceFactor) => {
                cameraState.setPartial({ distanceFactor });
                this.renderAppState();
            }
        });
    }

    createInteractionController({ cameraState, sceneController, sceneRuntime }) {
        const canvas = sceneRuntime.renderer.domElement;
        const pointerTracker = new PointerTracker(canvas);
        const dragStateUpdater = new DragStateUpdater({
            config: this.config,
            camera: sceneRuntime.camera,
            cameraState
        });
        const hoverController = new HoverController({
            camera: sceneRuntime.camera,
            canvas,
            sceneController
        });
        const snapAnimator = new SnapAnimator({
            config: this.config,
            cameraState,
            onUpdate: () => this.renderAppState()
        });

        return new InteractionController({
            camera: sceneRuntime.camera,
            canvas,
            cameraState,
            sceneController,
            pointerTracker,
            dragStateUpdater,
            hoverController,
            snapAnimator,
            onStateChange: () => this.renderAppState()
        });
    }

    renderAppState() {
        const snappedState = this.cameraState.getSnapped();
        const prompt = buildPrompt(this.config, snappedState, {
            detailed: this.overlayController.isDetailedEnabled()
        });

        this.sceneController.render(this.cameraState);
        this.distanceControlsController.setActiveDistance(snappedState.distanceFactor);
        this.overlayController.setPrompt(prompt);
    }

    handleResize() {
        const aspectRatio = window.innerWidth / window.innerHeight;

        this.sceneRuntime.camera.aspect = aspectRatio;
        applyResponsiveCamera(this.sceneRuntime.camera, aspectRatio);
        this.sceneRuntime.camera.updateProjectionMatrix();
        this.sceneRuntime.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        window.requestAnimationFrame(this.animate);
        this.sceneRuntime.renderer.render(this.sceneRuntime.scene, this.sceneRuntime.camera);
    }
}
