import { THREE } from "../vendor/three-context.js";

export function getDistanceSliderX(config, distanceFactor) {
    const {
        distanceSlider: { xMin, xMax },
        limits: {
            distance: { min, max }
        }
    } = config;
    const clampedFactor = THREE.MathUtils.clamp(distanceFactor, min, max);
    const progress = (max - clampedFactor) / (max - min);

    return THREE.MathUtils.lerp(xMin, xMax, progress);
}

export function getDistanceFactorFromSliderX(config, sliderX) {
    const {
        distanceSlider: { xMin, xMax },
        limits: {
            distance: { min, max }
        }
    } = config;
    const clampedX = THREE.MathUtils.clamp(sliderX, xMin, xMax);
    const progress = (clampedX - xMin) / (xMax - xMin);

    return max - progress * (max - min);
}

export function getDistanceSliderSnapPositions(config) {
    return [...config.snapSteps.distance]
        .reverse()
        .map((distanceFactor) => ({
            distanceFactor,
            x: getDistanceSliderX(config, distanceFactor)
        }));
}
