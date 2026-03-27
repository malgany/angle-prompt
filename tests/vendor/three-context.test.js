import { afterEach, describe, expect, it, vi } from "vitest";

describe("three-context", () => {
    afterEach(() => {
        vi.resetModules();
        globalThis.THREE = undefined;
    });

    it("returns the global THREE instance", async () => {
        const fakeThree = { marker: true };
        globalThis.THREE = fakeThree;

        const module = await import("../../src/vendor/three-context.js");
        expect(module.THREE).toBe(fakeThree);
    });

    it("throws when THREE is not present", async () => {
        delete globalThis.THREE;

        await expect(import("../../src/vendor/three-context.js")).rejects.toThrow("Three.js nao foi carregado.");
    });
});
