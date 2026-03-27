import { getShortestAngleDelta } from "../utils/angles.js";

export class SnapAnimator {
    constructor({ config, cameraState, onUpdate }) {
        this.config = config;
        this.cameraState = cameraState;
        this.onUpdate = onUpdate;
        this.frameId = null;
    }

    start() {
        this.cancel();

        const startState = this.cameraState.getRaw();
        const snappedState = this.cameraState.getSnapped();
        const startTime = Date.now();

        const animate = () => {
            const progress = this.getProgress(startTime);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            this.cameraState.setPartial({
                azimuth: startState.azimuth + getShortestAngleDelta(startState.azimuth, snappedState.azimuth) * easedProgress,
                elevation: startState.elevation + (snappedState.elevation - startState.elevation) * easedProgress,
                distanceFactor: startState.distanceFactor + (snappedState.distanceFactor - startState.distanceFactor) * easedProgress
            });
            this.onUpdate();

            if (progress < 1) {
                this.frameId = window.requestAnimationFrame(animate);
                return;
            }

            this.finish(snappedState);
        };

        this.frameId = window.requestAnimationFrame(animate);
    }

    cancel() {
        if (this.frameId === null) {
            return;
        }

        window.cancelAnimationFrame(this.frameId);
        this.frameId = null;
    }

    getProgress(startTime) {
        const elapsed = Date.now() - startTime;
        return Math.min(elapsed / this.config.snapDurationMs, 1);
    }

    finish(snappedState) {
        this.cameraState.setPartial({
            azimuth: snappedState.azimuth,
            elevation: snappedState.elevation,
            distanceFactor: snappedState.distanceFactor
        });
        this.onUpdate();
        this.frameId = null;
    }
}
