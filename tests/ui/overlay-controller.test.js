import { describe, expect, it, vi } from "vitest";

import { OverlayController } from "../../src/ui/overlay-controller.js";

describe("OverlayController", () => {
    it("updates the prompt text", () => {
        const controller = new OverlayController({
            overlayElement: document.createElement("button"),
            textElement: document.createElement("span"),
            clipboardService: { copyText: vi.fn(() => Promise.resolve()) },
            toastController: { show: vi.fn() }
        });

        controller.setPrompt("new prompt");
        expect(controller.textElement.textContent).toBe("new prompt");
    });

    it("copies the prompt and shows toast on click", async () => {
        const overlayElement = document.createElement("button");
        const textElement = document.createElement("span");
        const clipboardService = { copyText: vi.fn(() => Promise.resolve()) };
        const toastController = { show: vi.fn() };
        const controller = new OverlayController({
            overlayElement,
            textElement,
            clipboardService,
            toastController
        });

        textElement.textContent = "copy me";
        controller.attachCopy();
        overlayElement.click();
        await Promise.resolve();

        expect(clipboardService.copyText).toHaveBeenCalledWith("copy me");
        expect(toastController.show).toHaveBeenCalled();
    });
});
