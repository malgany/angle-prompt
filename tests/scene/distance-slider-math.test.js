import { describe, expect, it } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import {
    getDistanceFactorFromSliderX,
    getDistanceSliderSnapPositions,
    getDistanceSliderX
} from "../../src/scene/distance-slider-math.js";

describe("distance slider math", () => {
    it("maps distance presets from left to right as wide, medium, close-up", () => {
        expect(getDistanceSliderX(AppConfig, 1.4)).toBe(AppConfig.distanceSlider.xMin);
        expect(getDistanceSliderX(AppConfig, 1.0)).toBeCloseTo(0);
        expect(getDistanceSliderX(AppConfig, 0.6)).toBe(AppConfig.distanceSlider.xMax);
    });

    it("converts slider positions back into distance factors", () => {
        expect(getDistanceFactorFromSliderX(AppConfig, AppConfig.distanceSlider.xMin)).toBe(1.4);
        expect(getDistanceFactorFromSliderX(AppConfig, 0)).toBe(1.0);
        expect(getDistanceFactorFromSliderX(AppConfig, AppConfig.distanceSlider.xMax)).toBe(0.6);
    });

    it("returns snap marker positions in visual order", () => {
        const snapPositions = getDistanceSliderSnapPositions(AppConfig);

        expect(snapPositions.map(({ distanceFactor }) => distanceFactor)).toEqual([1.4, 1.0, 0.6]);
    });
});
