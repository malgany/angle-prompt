import { beforeEach, describe, expect, it, vi } from "vitest";

describe("createSceneRuntime", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("creates the runtime and inserts the renderer canvas", async () => {
        const fakeDomElement = { nodeName: "CANVAS" };
        const fakeThree = {
            Scene: class {
                constructor() {
                    this.add = vi.fn();
                    this.background = null;
                }
            },
            Color: class {
                constructor(value) {
                    this.value = value;
                }
            },
            PerspectiveCamera: class {
                constructor() {
                    this.position = { set: vi.fn() };
                    this.lookAt = vi.fn();
                }
            },
            WebGLRenderer: class {
                constructor() {
                    this.domElement = fakeDomElement;
                    this.setSize = vi.fn();
                    this.setPixelRatio = vi.fn();
                }
            },
            AmbientLight: class {},
            DirectionalLight: class {
                constructor() {
                    this.position = { set: vi.fn() };
                }
            },
            GridHelper: class {}
        };

        vi.doMock("../../src/vendor/three-context.js", () => ({ THREE: fakeThree }));
        vi.doMock("../../src/scene/factories/scene-objects-factory.js", () => ({
            createSceneObjects: vi.fn(() => ({
                nodes: [{ id: 1 }, { id: 2 }],
                cameraGroup: {},
                azimuthHandle: {},
                elevationHandle: {},
                distanceHandle: {},
                distanceLineGeometry: {}
            }))
        }));

        const { createSceneRuntime } = await import("../../src/scene/scene-bootstrap.js");
        const wrapperElement = { insertBefore: vi.fn() };
        const overlayElement = {};
        const runtime = createSceneRuntime({
            config: {},
            wrapperElement,
            overlayElement
        });

        expect(wrapperElement.insertBefore).toHaveBeenCalledWith(fakeDomElement, overlayElement);
        expect(runtime.renderer.domElement).toBe(fakeDomElement);
        expect(runtime.scene.add).toHaveBeenCalled();
    });
});
