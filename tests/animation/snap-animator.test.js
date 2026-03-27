import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import { SnapAnimator } from "../../src/animation/snap-animator.js";

describe("SnapAnimator", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-03-27T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("animates state until the snapped value", () => {
        const setPartial = vi.fn();
        const onUpdate = vi.fn();
        const cameraState = {
            getRaw: vi.fn(() => ({ azimuth: 350, elevation: 5, distanceFactor: 1 })),
            getSnapped: vi.fn(() => ({ azimuth: 0, elevation: 0, distanceFactor: 1.4 })),
            setPartial
        };
        const animator = new SnapAnimator({
            config: AppConfig,
            cameraState,
            onUpdate
        });

        animator.start();
        vi.advanceTimersByTime(AppConfig.snapDurationMs + 32);

        expect(setPartial).toHaveBeenCalled();
        expect(setPartial).toHaveBeenLastCalledWith({
            azimuth: 0,
            elevation: 0,
            distanceFactor: 1.4
        });
        expect(onUpdate).toHaveBeenCalled();
    });

    it("cancels a scheduled animation frame", () => {
        const animator = new SnapAnimator({
            config: AppConfig,
            cameraState: {
                getRaw: () => ({ azimuth: 0, elevation: 0, distanceFactor: 1 }),
                getSnapped: () => ({ azimuth: 0, elevation: 0, distanceFactor: 1 }),
                setPartial: vi.fn()
            },
            onUpdate: vi.fn()
        });

        animator.start();
        animator.cancel();

        expect(animator.frameId).toBeNull();
    });
});
