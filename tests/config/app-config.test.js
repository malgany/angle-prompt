import { describe, expect, it } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";

describe("AppConfig", () => {
    it("exposes frozen configuration objects", () => {
        expect(Object.isFrozen(AppConfig)).toBe(true);
        expect(Object.isFrozen(AppConfig.snapSteps)).toBe(true);
        expect(AppConfig.center.y).toBe(0.75);
    });
});
