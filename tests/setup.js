import * as Three from "three";
import { vi } from "vitest";

globalThis.THREE = Three;

Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
        writeText: vi.fn(() => Promise.resolve())
    }
});

window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 16);
window.cancelAnimationFrame = (id) => window.clearTimeout(id);
