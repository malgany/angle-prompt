import { describe, expect, it, vi } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import { DragStateUpdater } from "../../src/interaction/drag-state-updater.js";

describe("DragStateUpdater", () => {
    it("updates distance from pointer delta", () => {
        const cameraState = { setPartial: vi.fn() };
        const updater = new DragStateUpdater({
            config: AppConfig,
            camera: {},
            cameraState
        });

        updater.update(
            {
                type: "distance",
                startPointer: { y: 0.5 },
                startDistanceFactor: 1
            },
            { y: 0.2 }
        );

        expect(cameraState.setPartial).toHaveBeenCalledWith({
            distanceFactor: 1.45
        });
    });

    it("updates azimuth from plane intersection", () => {
        const cameraState = { setPartial: vi.fn() };
        const updater = new DragStateUpdater({
            config: AppConfig,
            camera: {},
            cameraState
        });

        updater.raycaster = {
            setFromCamera: vi.fn(),
            ray: {
                intersectPlane: vi.fn((_, intersection) => {
                    intersection.set(1, 0, 0);
                    return intersection;
                })
            }
        };

        updater.update({ type: "azimuth" }, { x: 0, y: 0 });
        expect(cameraState.setPartial).toHaveBeenCalledWith({ azimuth: 90 });
    });

    it("updates elevation from plane intersection", () => {
        const cameraState = { setPartial: vi.fn() };
        const updater = new DragStateUpdater({
            config: AppConfig,
            camera: {},
            cameraState
        });

        updater.raycaster = {
            setFromCamera: vi.fn(),
            ray: {
                intersectPlane: vi.fn((_, intersection) => {
                    intersection.set(0, AppConfig.center.y + 1, 1);
                    return intersection;
                })
            }
        };

        updater.update({ type: "elevation" }, { x: 0, y: 0 });
        expect(cameraState.setPartial).toHaveBeenCalledWith({ elevation: 45 });
    });
});
