export class HandleVisualController {
    constructor(handlesByType) {
        this.handlesByType = handlesByType;
    }

    reset() {
        this.getHandles().forEach((handle) => {
            this.apply(handle, 0.8, 1);
        });
    }

    activate(type, scale = 1.2) {
        const handle = this.handlesByType[type];
        if (!handle) {
            return;
        }

        this.apply(handle, 1.0, scale);
    }

    deactivate(type) {
        const handle = this.handlesByType[type];
        if (!handle) {
            return;
        }

        this.apply(handle, 0.8, 1);
    }

    getHandles() {
        return Object.values(this.handlesByType);
    }

    apply(handle, emissiveIntensity, scale) {
        handle.material.emissiveIntensity = emissiveIntensity;
        handle.scale.setScalar(scale);
    }
}
