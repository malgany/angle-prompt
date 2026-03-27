import { describe, expect, it } from "vitest";

import { HandleVisualController } from "../../src/scene/handle-visual-controller.js";

function createHandle() {
    return {
        material: { emissiveIntensity: 0.8 },
        scale: {
            value: 1,
            setScalar(nextValue) {
                this.value = nextValue;
            }
        }
    };
}

describe("HandleVisualController", () => {
    it("resets and activates handles", () => {
        const handles = {
            azimuth: createHandle(),
            elevation: createHandle(),
            distance: createHandle()
        };
        const controller = new HandleVisualController(handles);

        controller.activate("azimuth", 1.3);
        expect(handles.azimuth.material.emissiveIntensity).toBe(1);
        expect(handles.azimuth.scale.value).toBe(1.3);

        controller.reset();
        expect(handles.azimuth.material.emissiveIntensity).toBe(0.8);
        expect(handles.azimuth.scale.value).toBe(1);
    });

    it("deactivates a handle", () => {
        const handles = { azimuth: createHandle() };
        const controller = new HandleVisualController(handles);

        controller.deactivate("azimuth");
        expect(handles.azimuth.material.emissiveIntensity).toBe(0.8);
        expect(handles.azimuth.scale.value).toBe(1);
    });
});
