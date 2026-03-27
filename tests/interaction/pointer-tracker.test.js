import { describe, expect, it } from "vitest";

import { PointerTracker } from "../../src/interaction/pointer-tracker.js";

describe("PointerTracker", () => {
    it("maps mouse coordinates to normalized device coordinates", () => {
        const canvas = {
            getBoundingClientRect: () => ({ left: 10, top: 20, width: 100, height: 200 })
        };
        const tracker = new PointerTracker(canvas);

        const pointer = tracker.update({ clientX: 60, clientY: 120 });
        expect(pointer.x).toBe(0);
        expect(pointer.y).toBe(0);
    });

    it("reads touch events from the first touch point", () => {
        const canvas = {
            getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 })
        };
        const tracker = new PointerTracker(canvas);

        const pointer = tracker.update({
            touches: [{ clientX: 100, clientY: 0 }]
        });

        expect(pointer.x).toBe(1);
        expect(pointer.y).toBe(1);
    });
});
