import { THREE } from "../vendor/three-context.js";
import { normalizeAzimuth } from "../utils/angles.js";
import { snapToNearest } from "../utils/snap.js";

export class CameraState {
    constructor(config, initialState) {
        this.config = config;
        this.state = this.normalizeState(initialState);
    }

    getRaw() {
        return { ...this.state };
    }

    setPartial(partialState) {
        this.state = this.normalizeState({
            ...this.state,
            ...partialState
        });

        return this.getRaw();
    }

    getSnapped() {
        const rawState = this.getRaw();
        const distanceFactor = snapToNearest(rawState.distanceFactor, this.config.snapSteps.distance);

        return {
            azimuth: snapToNearest(rawState.azimuth, this.config.snapSteps.azimuth),
            elevation: snapToNearest(rawState.elevation, this.config.snapSteps.elevation),
            distanceFactor,
            distanceKey: distanceFactor === 1 ? "1.0" : distanceFactor.toFixed(1)
        };
    }

    normalizeState(state) {
        return {
            azimuth: normalizeAzimuth(state.azimuth),
            elevation: THREE.MathUtils.clamp(
                state.elevation,
                this.config.limits.elevation.min,
                this.config.limits.elevation.max
            ),
            distanceFactor: THREE.MathUtils.clamp(
                state.distanceFactor,
                this.config.limits.distance.min,
                this.config.limits.distance.max
            )
        };
    }
}
