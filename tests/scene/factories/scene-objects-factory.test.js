import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Three from "three";

vi.mock("../../../src/scene/factories/placeholder-texture-factory.js", () => ({
    createPlaceholderTexture: vi.fn(() => new Three.Texture())
}));

describe("createSceneObjects", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("creates all scene nodes and handles", async () => {
        const { AppConfig } = await import("../../../src/config/app-config.js");
        const { createSceneObjects } = await import("../../../src/scene/factories/scene-objects-factory.js");

        const sceneObjects = createSceneObjects(AppConfig);

        expect(sceneObjects.nodes).toHaveLength(12);
        expect(sceneObjects.azimuthHandle.userData.type).toBe("azimuth");
        expect(sceneObjects.elevationHandle.userData.type).toBe("elevation");
        expect(sceneObjects.distanceHandle.userData.type).toBe("distance");
        expect(sceneObjects.azimuthHandle.material.color.getHex()).toBe(0x2f8cff);
        expect(sceneObjects.elevationHandle.material.color.getHex()).toBe(0xff4d4d);
        expect(sceneObjects.distanceHandle.material.color.getHex()).toBe(0xffeb2f);
        expect(sceneObjects.azimuthSnapMarkers.children).toHaveLength(AppConfig.snapSteps.azimuth.length);
        expect(sceneObjects.elevationSnapMarkers.children).toHaveLength(AppConfig.snapSteps.elevation.length);
        expect(sceneObjects.distanceSnapMarkers.children).toHaveLength(AppConfig.snapSteps.distance.length);
        expect(sceneObjects.distanceLineGeometry).toBeDefined();
        expect(sceneObjects.cameraGroup.children.length).toBe(2);
    });
});
