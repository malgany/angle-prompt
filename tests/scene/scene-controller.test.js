import { describe, expect, it, vi } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import { SceneController } from "../../src/scene/scene-controller.js";

function createPositionRecorder() {
    return {
        values: null,
        set(...nextValues) {
            this.values = nextValues;
        },
        copy(nextValue) {
            this.values = [nextValue.x, nextValue.y, nextValue.z];
        }
    };
}

describe("SceneController", () => {
    it("renders the scene state into camera and handles", () => {
        const cameraGroupPosition = createPositionRecorder();
        const sceneObjects = {
            cameraGroup: {
                position: cameraGroupPosition,
                lookAt: vi.fn()
            },
            azimuthHandle: { position: createPositionRecorder() },
            elevationHandle: { position: createPositionRecorder() },
            distanceLineGeometry: { setFromPoints: vi.fn() }
        };
        const handleVisualController = {
            getHandles: vi.fn(() => []),
            reset: vi.fn(),
            activate: vi.fn(),
            deactivate: vi.fn()
        };
        const controller = new SceneController({
            config: AppConfig,
            sceneObjects,
            handleVisualController
        });

        controller.render({
            getRaw: () => ({ azimuth: 0, elevation: 0, distanceFactor: 1 })
        });

        expect(cameraGroupPosition.values).toEqual([0, AppConfig.center.y, AppConfig.baseDistance]);
        expect(sceneObjects.cameraGroup.lookAt).toHaveBeenCalledWith(AppConfig.center);
        expect(sceneObjects.azimuthHandle.position.values).toEqual([0, AppConfig.azimuthPlaneY, AppConfig.azimuthRadius]);
        expect(sceneObjects.elevationHandle.position.values).toEqual([
            AppConfig.elevationPlaneX,
            AppConfig.center.y,
            AppConfig.elevationRadius
        ]);
        expect(sceneObjects.distanceLineGeometry.setFromPoints).toHaveBeenCalledTimes(1);
    });
});
