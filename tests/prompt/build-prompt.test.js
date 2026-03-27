import { describe, expect, it } from "vitest";

import { AppConfig } from "../../src/config/app-config.js";
import { buildPrompt } from "../../src/prompt/build-prompt.js";

describe("buildPrompt", () => {
    it("builds the final prompt string from snapped state", () => {
        const prompt = buildPrompt(AppConfig, {
            azimuth: 90,
            elevation: 30,
            distanceKey: "1.4"
        });

        expect(prompt).toContain("right side view");
        expect(prompt).toContain("elevated shot");
        expect(prompt).toContain("wide shot");
        expect(prompt).toContain("Maintain consistency.");
    });

    it("builds the simplified prompt when detail mode is disabled", () => {
        const prompt = buildPrompt(AppConfig, {
            azimuth: 90,
            elevation: 30,
            distanceKey: "1.0"
        }, {
            detailed: false
        });

        expect(prompt).toBe("right side view elevated shot medium shot");
    });
});
