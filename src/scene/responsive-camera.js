export function applyResponsiveCamera(camera, aspectRatio) {
    const profile = getCameraProfile(aspectRatio);

    camera.fov = profile.fov;
    camera.position.set(profile.x, profile.y, profile.z);
    camera.lookAt(0, 0.75, 0);

    return profile;
}

function getCameraProfile(aspectRatio) {
    if (aspectRatio <= 0.5) {
        return {
            fov: 86,
            x: 9.4,
            y: 5.8,
            z: 9.4
        };
    }

    if (aspectRatio <= 0.75) {
        return {
            fov: 68,
            x: 6.8,
            y: 4.2,
            z: 6.8
        };
    }

    return {
        fov: 50,
        x: 4.5,
        y: 3,
        z: 4.5
    };
}
