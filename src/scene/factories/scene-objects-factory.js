import { THREE } from "../../vendor/three-context.js";
import { createPlaceholderTexture } from "./placeholder-texture-factory.js";

export function createSceneObjects(config) {
    const targetPlane = createTargetPlane(config);
    const cameraGroup = createCameraGroup();
    const azimuthRing = createAzimuthRing(config);
    const azimuthHandle = createHandle(0x00ff88, "azimuth");
    const elevationArc = createElevationArc(config);
    const elevationHandle = createHandle(0xff69b4, "elevation");
    const distanceLineGeometry = new THREE.BufferGeometry();
    const distanceLine = createDistanceLine(distanceLineGeometry);

    return {
        nodes: [
            targetPlane,
            cameraGroup,
            azimuthRing,
            azimuthHandle,
            elevationArc,
            elevationHandle,
            distanceLine
        ],
        cameraGroup,
        azimuthHandle,
        elevationHandle,
        distanceLineGeometry
    };
}

function createTargetPlane(config) {
    const material = new THREE.MeshBasicMaterial({
        map: createPlaceholderTexture(),
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), material);
    plane.position.copy(config.center);
    return plane;
}

function createCameraGroup() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
        color: 0x6699cc,
        metalness: 0.5,
        roughness: 0.3
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.38), material);
    group.add(body);

    const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.11, 0.18, 16),
        material.clone()
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.26;
    group.add(lens);

    return group;
}

function createAzimuthRing(config) {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.azimuthRadius, 0.04, 16, 64),
        new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.3
        })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = config.azimuthPlaneY;
    return ring;
}

function createElevationArc(config) {
    const points = [];

    for (let index = 0; index <= 32; index += 1) {
        const angle = THREE.MathUtils.degToRad(-30 + (90 * index) / 32);
        points.push(
            new THREE.Vector3(
                config.elevationPlaneX,
                config.elevationRadius * Math.sin(angle) + config.center.y,
                config.elevationRadius * Math.cos(angle)
            )
        );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.04, 8, false),
        new THREE.MeshStandardMaterial({
            color: 0xff69b4,
            emissive: 0xff69b4,
            emissiveIntensity: 0.3
        })
    );
}

function createDistanceLine(distanceLineGeometry) {
    return new THREE.Line(
        distanceLineGeometry,
        new THREE.LineBasicMaterial({ color: 0xffa500 })
    );
}

function createHandle(color, type) {
    const handle = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.8
        })
    );
    handle.userData.type = type;
    return handle;
}
