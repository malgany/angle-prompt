import { describe, expect, it, vi } from "vitest";

import { ClipboardService } from "../../src/services/clipboard-service.js";

describe("ClipboardService", () => {
    it("delegates to navigator.clipboard.writeText", async () => {
        const writeText = vi.fn(() => Promise.resolve());
        navigator.clipboard.writeText = writeText;

        const service = new ClipboardService();
        await service.copyText("abc");

        expect(writeText).toHaveBeenCalledWith("abc");
    });
});
