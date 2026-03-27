import { describe, expect, it, vi } from "vitest";

import { InteractionController } from "../../src/interaction/interaction-controller.js";

describe("InteractionController", () => {
    function createController() {
        const canvas = {
            style: { cursor: "default" },
            addEventListener: vi.fn()
        };
        const cameraState = {
            getRaw: vi.fn(() => ({ distanceFactor: 1 }))
        };
        const sceneController = {
            getInteractiveHandles: vi.fn(() => ["handle"]),
            activateHandle: vi.fn(),
            deactivateHandle: vi.fn()
        };
        const controller = new InteractionController({
            camera: {},
            canvas,
            cameraState,
            sceneController,
            pointerTracker: { update: vi.fn(() => ({ x: 0, y: 0, clone: () => ({ x: 0, y: 0 }) })) },
            dragStateUpdater: { update: vi.fn() },
            hoverController: { update: vi.fn(), clear: vi.fn() },
            snapAnimator: { start: vi.fn(), cancel: vi.fn() },
            onStateChange: vi.fn()
        });

        controller.raycaster = {
            setFromCamera: vi.fn(),
            intersectObjects: vi.fn(() => [{ object: { userData: { type: "azimuth" } } }])
        };

        return { controller, canvas };
    }

    it("attaches pointer listeners", () => {
        const { controller, canvas } = createController();
        const windowSpy = vi.spyOn(window, "addEventListener");

        controller.attach();

        expect(canvas.addEventListener).toHaveBeenCalled();
        expect(windowSpy).toHaveBeenCalled();
        windowSpy.mockRestore();
    });

    it("starts dragging when a handle is picked", () => {
        const { controller, canvas } = createController();
        const event = {
            target: canvas,
            preventDefault: vi.fn()
        };

        controller.handlePointerDown(event);

        expect(controller.dragSession.type).toBe("azimuth");
        expect(controller.sceneController.activateHandle).toHaveBeenCalledWith("azimuth", 1.3);
        expect(canvas.style.cursor).toBe("grabbing");
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it("delegates hover updates when not dragging", () => {
        const { controller } = createController();
        const event = { preventDefault: vi.fn() };

        controller.handlePointerMove(event);

        expect(controller.hoverController.update).toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("updates state while dragging and snaps on release", () => {
        const { controller, canvas } = createController();
        controller.dragSession = {
            type: "distance",
            startPointer: { y: 0 },
            startDistanceFactor: 1
        };

        const event = { preventDefault: vi.fn() };
        controller.handlePointerMove(event);
        controller.handlePointerUp();

        expect(controller.dragStateUpdater.update).toHaveBeenCalled();
        expect(controller.onStateChange).toHaveBeenCalled();
        expect(controller.sceneController.deactivateHandle).toHaveBeenCalledWith("distance");
        expect(controller.snapAnimator.start).toHaveBeenCalled();
        expect(controller.dragSession).toBeNull();
        expect(canvas.style.cursor).toBe("default");
    });
});
