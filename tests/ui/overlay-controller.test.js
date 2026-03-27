import { describe, expect, it, vi } from "vitest";

import { OverlayController } from "../../src/ui/overlay-controller.js";

describe("OverlayController", () => {
    it("updates the prompt text", () => {
        const controller = new OverlayController({
            panelElement: document.createElement("div"),
            toggleButtonElement: document.createElement("button"),
            copyButtonElement: document.createElement("button"),
            detailToggleElement: document.createElement("input"),
            textElement: document.createElement("span"),
            clipboardService: { copyText: vi.fn(() => Promise.resolve()) },
            toastController: { show: vi.fn() }
        });

        controller.setPrompt("new prompt");
        expect(controller.textElement.textContent).toBe("new prompt");
    });

    it("copies the prompt and shows toast on click", async () => {
        const copyButtonElement = document.createElement("button");
        const panelElement = document.createElement("div");
        panelElement.classList.add("is-open");
        const toggleButtonElement = document.createElement("button");
        const detailToggleElement = document.createElement("input");
        const textElement = document.createElement("span");
        const clipboardService = { copyText: vi.fn(() => Promise.resolve()) };
        const toastController = { show: vi.fn() };
        const controller = new OverlayController({
            panelElement,
            toggleButtonElement,
            copyButtonElement,
            detailToggleElement,
            textElement,
            clipboardService,
            toastController
        });

        textElement.textContent = "copy me";
        controller.attachCopy();
        copyButtonElement.click();
        await Promise.resolve();

        expect(clipboardService.copyText).toHaveBeenCalledWith("copy me");
        expect(toastController.show).toHaveBeenCalled();
        expect(panelElement.classList.contains("is-open")).toBe(true);
    });

    it("reports detail mode changes", () => {
        const detailToggleElement = document.createElement("input");
        detailToggleElement.type = "checkbox";
        detailToggleElement.checked = true;
        const onDetailToggle = vi.fn();
        const controller = new OverlayController({
            panelElement: document.createElement("div"),
            toggleButtonElement: document.createElement("button"),
            copyButtonElement: document.createElement("button"),
            detailToggleElement,
            textElement: document.createElement("span"),
            clipboardService: { copyText: vi.fn(() => Promise.resolve()) },
            toastController: { show: vi.fn() }
        });

        controller.attachDetailToggle(onDetailToggle);
        detailToggleElement.checked = false;
        detailToggleElement.dispatchEvent(new Event("change"));

        expect(controller.isDetailedEnabled()).toBe(false);
        expect(onDetailToggle).toHaveBeenCalledWith(false);
    });

    it("toggles the prompt panel visibility", () => {
        const panelElement = document.createElement("div");
        const toggleButtonElement = document.createElement("button");
        const controller = new OverlayController({
            panelElement,
            toggleButtonElement,
            copyButtonElement: document.createElement("button"),
            detailToggleElement: document.createElement("input"),
            textElement: document.createElement("span"),
            clipboardService: { copyText: vi.fn(() => Promise.resolve()) },
            toastController: { show: vi.fn() }
        });

        controller.attachPanelToggle();
        toggleButtonElement.click();

        expect(panelElement.classList.contains("is-open")).toBe(true);
        expect(toggleButtonElement.getAttribute("aria-expanded")).toBe("true");
    });
});
