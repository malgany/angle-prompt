import { describe, expect, it, vi } from "vitest";

import { HoverController } from "../../src/interaction/hover-controller.js";

describe("HoverController", () => {
    it("activates the hovered handle", () => {
        const canvas = { style: { cursor: "default" } };
        const sceneController = {
            resetHandleVisuals: vi.fn(),
            activateHandle: vi.fn(),
            getInteractiveHandles: vi.fn(() => ["a"])
        };
        const controller = new HoverController({
            camera: {},
            canvas,
            sceneController
        });

        controller.raycaster = {
            setFromCamera: vi.fn(),
            intersectObjects: vi.fn(() => [{ object: { userData: { type: "azimuth" } } }])
        };

        controller.update({ x: 0, y: 0 });

        expect(sceneController.resetHandleVisuals).toHaveBeenCalled();
        expect(sceneController.activateHandle).toHaveBeenCalledWith("azimuth", 1.2);
        expect(canvas.style.cursor).toBe("grab");
    });

    it("clears hover state when nothing is intersected", () => {
        const canvas = { style: { cursor: "grab" } };
        const sceneController = {
            resetHandleVisuals: vi.fn(),
            activateHandle: vi.fn(),
            getInteractiveHandles: vi.fn(() => [])
        };
        const controller = new HoverController({
            camera: {},
            canvas,
            sceneController
        });

        controller.raycaster = {
            setFromCamera: vi.fn(),
            intersectObjects: vi.fn(() => [])
        };

        controller.update({ x: 0, y: 0 });
        controller.clear();

        expect(canvas.style.cursor).toBe("default");
        expect(sceneController.activateHandle).not.toHaveBeenCalled();
    });
});
