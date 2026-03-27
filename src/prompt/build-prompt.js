export function buildPrompt(config, snappedState, { detailed = true } = {}) {
    const azimuthName = config.promptNames.azimuth[snappedState.azimuth];
    const elevationName = config.promptNames.elevation[String(snappedState.elevation)];
    const distanceName = config.promptNames.distance[snappedState.distanceKey];

    if (!detailed) {
        return `${azimuthName} ${elevationName} ${distanceName}`;
    }

    return `Using the attached image, generate an image viewed from a new angle. The camera must be in a ${azimuthName}, captured as an ${elevationName}, framed as a ${distanceName}. Maintain consistency.`;
}
