import { describe, expect, it, vi } from "vitest";

const init = vi.fn();
const AppMock = vi.fn(function MockApp() {
    this.init = init;
});

vi.mock("../src/app/app.js", () => ({
    App: AppMock
}));
vi.mock("../src/config/app-config.js", () => ({
    AppConfig: { marker: true }
}));

describe("main", () => {
    it("creates the app and initializes it", async () => {
        await import("../src/main.js");

        expect(AppMock).toHaveBeenCalledWith({ marker: true });
        expect(init).toHaveBeenCalled();
    });
});
