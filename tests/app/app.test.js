import { beforeEach, describe, expect, it, vi } from "vitest";

const createSceneRuntime = vi.fn();
const buildPrompt = vi.fn(() => "prompt");
const renderSpy = vi.fn();
const attachCopy = vi.fn();
const attachPanelToggle = vi.fn();
const attachDetailToggle = vi.fn();
const attachDistanceControls = vi.fn();
const attachInteraction = vi.fn();
const sceneRender = vi.fn();
const overlaySetPrompt = vi.fn();
const overlayIsDetailedEnabled = vi.fn(() => true);
const setActiveDistance = vi.fn();
const cameraUpdateProjectionMatrix = vi.fn();
const rendererSetSize = vi.fn();

vi.mock("../../src/scene/scene-bootstrap.js", () => ({
    createSceneRuntime
}));
vi.mock("../../src/prompt/build-prompt.js", () => ({
    buildPrompt
}));
vi.mock("../../src/scene/handle-visual-controller.js", () => ({
    HandleVisualController: vi.fn(function MockHandleVisualController() {})
}));
vi.mock("../../src/scene/scene-controller.js", () => ({
    SceneController: vi.fn(function MockSceneController() {
        this.render = sceneRender;
    })
}));
vi.mock("../../src/services/clipboard-service.js", () => ({
    ClipboardService: vi.fn(function MockClipboardService() {})
}));
vi.mock("../../src/state/camera-state.js", () => ({
    CameraState: vi.fn(function MockCameraState() {
        this.getSnapped = vi.fn(() => ({ azimuth: 0, elevation: 0, distanceFactor: 1, distanceKey: "1.0" }));
    })
}));
vi.mock("../../src/interaction/pointer-tracker.js", () => ({
    PointerTracker: vi.fn(function MockPointerTracker() {})
}));
vi.mock("../../src/interaction/drag-state-updater.js", () => ({
    DragStateUpdater: vi.fn(function MockDragStateUpdater() {})
}));
vi.mock("../../src/interaction/hover-controller.js", () => ({
    HoverController: vi.fn(function MockHoverController() {})
}));
vi.mock("../../src/animation/snap-animator.js", () => ({
    SnapAnimator: vi.fn(function MockSnapAnimator() {})
}));
vi.mock("../../src/interaction/interaction-controller.js", () => ({
    InteractionController: vi.fn(function MockInteractionController() {
        this.attach = attachInteraction;
    })
}));
vi.mock("../../src/ui/overlay-controller.js", () => ({
    OverlayController: vi.fn(function MockOverlayController() {
        this.attachCopy = attachCopy;
        this.attachPanelToggle = attachPanelToggle;
        this.attachDetailToggle = attachDetailToggle;
        this.isDetailedEnabled = overlayIsDetailedEnabled;
        this.setPrompt = overlaySetPrompt;
    })
}));
vi.mock("../../src/ui/distance-controls-controller.js", () => ({
    DistanceControlsController: vi.fn(function MockDistanceControlsController() {
        this.attach = attachDistanceControls;
        this.setActiveDistance = setActiveDistance;
    })
}));
vi.mock("../../src/ui/toast-controller.js", () => ({
    ToastController: vi.fn(function MockToastController() {})
}));

describe("App", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        document.body.innerHTML = `
            <div id="camera-control-wrapper"></div>
            <div id="scene-ui-layer"></div>
            <div id="prompt-overlay"></div>
            <button id="prompt-toggle-button"></button>
            <button id="prompt-copy-button"></button>
            <input id="prompt-detail-toggle" type="checkbox" checked />
            <span id="prompt-text"></span>
            <div id="toast"></div>
            <button data-distance-factor="1.4"></button>
            <button data-distance-factor="1.0"></button>
            <button data-distance-factor="0.6"></button>
        `;
        window.requestAnimationFrame = vi.fn();
        createSceneRuntime.mockReturnValue({
            scene: {},
            camera: {
                aspect: 0,
                position: { set: vi.fn() },
                lookAt: vi.fn(),
                updateProjectionMatrix: cameraUpdateProjectionMatrix
            },
            renderer: {
                domElement: {},
                setSize: rendererSetSize,
                render: renderSpy
            },
            sceneObjects: {
                azimuthHandle: {},
                elevationHandle: {}
            }
        });
    });

    it("initializes the application and renders the first state", async () => {
        const { App } = await import("../../src/app/app.js");
        const app = new App({});

        app.init();

        expect(createSceneRuntime).toHaveBeenCalled();
        expect(attachCopy).toHaveBeenCalled();
        expect(attachPanelToggle).toHaveBeenCalled();
        expect(attachDetailToggle).toHaveBeenCalled();
        expect(attachDistanceControls).toHaveBeenCalled();
        expect(attachInteraction).toHaveBeenCalled();
        expect(sceneRender).toHaveBeenCalled();
        expect(setActiveDistance).toHaveBeenCalledWith(1);
        expect(overlaySetPrompt).toHaveBeenCalledWith("prompt");
    });

    it("resizes and animates using the scene runtime", async () => {
        const { App } = await import("../../src/app/app.js");
        const app = new App({});
        app.init();

        app.handleResize();
        app.animate();

        expect(cameraUpdateProjectionMatrix).toHaveBeenCalled();
        expect(rendererSetSize).toHaveBeenCalled();
        expect(renderSpy).toHaveBeenCalled();
    });
});
