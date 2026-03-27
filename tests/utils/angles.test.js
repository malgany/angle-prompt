import { describe, expect, it } from "vitest";

import { getShortestAngleDelta, normalizeAzimuth } from "../../src/utils/angles.js";

describe("angles", () => {
    it("normalizes negative and overflowing azimuth values", () => {
        expect(normalizeAzimuth(-90)).toBe(270);
        expect(normalizeAzimuth(450)).toBe(90);
    });

    it("returns the shortest angular delta", () => {
        expect(getShortestAngleDelta(350, 10)).toBe(20);
        expect(getShortestAngleDelta(10, 350)).toBe(-20);
    });
});
