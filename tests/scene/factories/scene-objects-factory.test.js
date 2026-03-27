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

        expect(sceneObjects.nodes).toHaveLength(8);
        expect(sceneObjects.azimuthHandle.userData.type).toBe("azimuth");
        expect(sceneObjects.elevationHandle.userData.type).toBe("elevation");
        expect(sceneObjects.distanceHandle.userData.type).toBe("distance");
        expect(sceneObjects.cameraGroup.children.length).toBe(2);
    });
});
