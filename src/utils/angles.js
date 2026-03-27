export function normalizeAzimuth(value) {
    const normalizedValue = value % 360;
    return normalizedValue < 0 ? normalizedValue + 360 : normalizedValue;
}

export function getShortestAngleDelta(startAngle, targetAngle) {
    let delta = targetAngle - startAngle;

    if (delta > 180) {
        delta -= 360;
    }

    if (delta < -180) {
        delta += 360;
    }

    return delta;
}
