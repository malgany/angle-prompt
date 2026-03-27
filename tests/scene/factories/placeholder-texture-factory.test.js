import { describe, expect, it, vi } from "vitest";
import * as Three from "three";

import { createPlaceholderTexture } from "../../../src/scene/factories/placeholder-texture-factory.js";

describe("createPlaceholderTexture", () => {
    it("creates a canvas texture from a generated canvas", () => {
        const context = {
            fillStyle: "",
            strokeStyle: "",
            lineWidth: 0,
            fillRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn()
        };
        const canvas = {
            width: 0,
            height: 0,
            getContext: vi.fn(() => context)
        };
        const createElementSpy = vi.spyOn(document, "createElement").mockReturnValue(canvas);

        const texture = createPlaceholderTexture();

        expect(texture).toBeInstanceOf(Three.CanvasTexture);
        expect(canvas.width).toBe(256);
        expect(canvas.height).toBe(256);
        expect(canvas.getContext).toHaveBeenCalledWith("2d");

        createElementSpy.mockRestore();
    });
});
