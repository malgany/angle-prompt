import { describe, expect, it } from "vitest";

import { snapToNearest } from "../../src/utils/snap.js";

describe("snapToNearest", () => {
    it("returns the nearest step", () => {
        expect(snapToNearest(46, [0, 45, 90])).toBe(45);
    });

    it("keeps the first value on exact tie", () => {
        expect(snapToNearest(22.5, [0, 45])).toBe(0);
    });
});
