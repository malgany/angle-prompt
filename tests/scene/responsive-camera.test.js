import { describe, expect, it, vi } from "vitest";

import { applyResponsiveCamera } from "../../src/scene/responsive-camera.js";

function createCamera() {
    return {
        fov: 50,
        position: { set: vi.fn() },
        lookAt: vi.fn()
    };
}

describe("applyResponsiveCamera", () => {
    it("keeps the default framing on wide screens", () => {
        const camera = createCamera();

        applyResponsiveCamera(camera, 1.2);

        expect(camera.fov).toBe(50);
        expect(camera.position.set).toHaveBeenCalledWith(4.5, 3, 4.5);
    });

    it("pushes the camera back on narrow screens", () => {
        const camera = createCamera();

        applyResponsiveCamera(camera, 0.46);

        expect(camera.fov).toBe(78);
        expect(camera.position.set).toHaveBeenCalledWith(7.8, 4.8, 7.8);
        expect(camera.lookAt).toHaveBeenCalledWith(0, 0.75, 0);
    });
});
