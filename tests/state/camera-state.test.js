import { describe, expect, it } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import { CameraState } from "../../src/state/camera-state.js";

describe("CameraState", () => {
    it("normalizes and clamps values on construction", () => {
        const state = new CameraState(AppConfig, {
            azimuth: -45,
            elevation: 120,
            distanceFactor: 10
        });

        expect(state.getRaw()).toEqual({
            azimuth: 315,
            elevation: 60,
            distanceFactor: 1.4
        });
    });

    it("updates partial state and preserves invariants", () => {
        const state = new CameraState(AppConfig, {
            azimuth: 0,
            elevation: 0,
            distanceFactor: 1
        });

        state.setPartial({
            azimuth: 725,
            elevation: -50,
            distanceFactor: 0.2
        });

        expect(state.getRaw()).toEqual({
            azimuth: 5,
            elevation: -30,
            distanceFactor: 0.6
        });
    });

    it("returns snapped values and normalized distance key", () => {
        const state = new CameraState(AppConfig, {
            azimuth: 44,
            elevation: 12,
            distanceFactor: 1.02
        });

        expect(state.getSnapped()).toEqual({
            azimuth: 45,
            elevation: 0,
            distanceFactor: 1,
            distanceKey: "1.0"
        });
    });
});
