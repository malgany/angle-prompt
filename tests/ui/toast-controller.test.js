import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastController } from "../../src/ui/toast-controller.js";

describe("ToastController", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows and hides the toast", () => {
        const toastElement = { style: { opacity: "0" } };
        const controller = new ToastController(toastElement);

        controller.show(2000);
        expect(toastElement.style.opacity).toBe("1");

        vi.advanceTimersByTime(2000);
        expect(toastElement.style.opacity).toBe("0");
    });
});
