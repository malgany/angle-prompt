import { describe, expect, it, vi } from "vitest";

import { DistanceControlsController } from "../../src/ui/distance-controls-controller.js";

describe("DistanceControlsController", () => {
    it("marks the active distance preset", () => {
        const wideButton = document.createElement("button");
        wideButton.dataset.distanceFactor = "1.4";
        const mediumButton = document.createElement("button");
        mediumButton.dataset.distanceFactor = "1.0";
        const closeButton = document.createElement("button");
        closeButton.dataset.distanceFactor = "0.6";
        const controller = new DistanceControlsController({
            buttonElements: [wideButton, mediumButton, closeButton],
            onSelectDistance: vi.fn()
        });

        controller.setActiveDistance(1);

        expect(mediumButton.classList.contains("is-active")).toBe(true);
        expect(mediumButton.getAttribute("aria-pressed")).toBe("true");
        expect(wideButton.classList.contains("is-active")).toBe(false);
    });

    it("forwards the selected preset distance", () => {
        const onSelectDistance = vi.fn();
        const buttonElement = document.createElement("button");
        buttonElement.dataset.distanceFactor = "0.6";
        const controller = new DistanceControlsController({
            buttonElements: [buttonElement],
            onSelectDistance
        });

        controller.attach();
        buttonElement.click();

        expect(onSelectDistance).toHaveBeenCalledWith(0.6);
    });
});
