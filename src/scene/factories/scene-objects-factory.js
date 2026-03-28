import { THREE } from "../../vendor/three-context.js";
import { getDistanceSliderSnapPositions } from "../distance-slider-math.js";
import { createPlaceholderTexture } from "./placeholder-texture-factory.js";

export function createSceneObjects(config) {
    const targetPlane = createTargetPlane(config);
    const cameraGroup = createCameraGroup();
    const azimuthRing = createAzimuthRing(config);
    const azimuthSnapMarkers = createAzimuthSnapMarkers(config);
    const azimuthHandle = createHandle(0x2f8cff, "azimuth");
    const elevationArc = createElevationArc(config);
    const elevationSnapMarkers = createElevationSnapMarkers(config);
    const elevationHandle = createHandle(0xff4d4d, "elevation");
    const distanceSliderRail = createDistanceSliderRail(config);
    const distanceSnapMarkers = createDistanceSnapMarkers(config);
    const distanceHandle = createHandle(0xffeb2f, "distance");
    const distanceLineGeometry = new THREE.BufferGeometry();
    const distanceLine = createDistanceLine(distanceLineGeometry);

    return {
        nodes: [
            targetPlane,
            cameraGroup,
            azimuthRing,
            azimuthSnapMarkers,
            azimuthHandle,
            elevationArc,
            elevationSnapMarkers,
            elevationHandle,
            distanceSliderRail,
            distanceSnapMarkers,
            distanceHandle,
            distanceLine
        ],
        cameraGroup,
        azimuthSnapMarkers,
        azimuthHandle,
        elevationSnapMarkers,
        elevationHandle,
        distanceSliderRail,
        distanceSnapMarkers,
        distanceHandle,
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
            color: 0x2f8cff,
            emissive: 0x2f8cff,
            emissiveIntensity: 0.3
        })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = config.azimuthPlaneY;
    return ring;
}

function createAzimuthSnapMarkers(config) {
    return createSnapMarkerGroup(
        0x2f8cff,
        config.snapSteps.azimuth.map((azimuth) => {
            const radians = THREE.MathUtils.degToRad(azimuth);

            return new THREE.Vector3(
                config.azimuthRadius * Math.sin(radians),
                config.azimuthPlaneY,
                config.azimuthRadius * Math.cos(radians)
            );
        })
    );
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
            color: 0xff4d4d,
            emissive: 0xff4d4d,
            emissiveIntensity: 0.3
        })
    );
}

function createElevationSnapMarkers(config) {
    return createSnapMarkerGroup(
        0xff4d4d,
        config.snapSteps.elevation.map((elevation) => {
            const radians = THREE.MathUtils.degToRad(elevation);

            return new THREE.Vector3(
                config.elevationPlaneX,
                config.elevationRadius * Math.sin(radians) + config.center.y,
                config.elevationRadius * Math.cos(radians)
            );
        })
    );
}

function createDistanceSliderRail(config) {
    const {
        distanceSlider: { xMin, xMax, y, z }
    } = config;
    const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, xMax - xMin, 24),
        new THREE.MeshStandardMaterial({
            color: 0xffd400,
            emissive: 0xffd400,
            emissiveIntensity: 0.4
        })
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set((xMin + xMax) / 2, y, z);
    return rail;
}

function createDistanceSnapMarkers(config) {
    const {
        distanceSlider: { y, z }
    } = config;

    return createSnapMarkerGroup(
        0xffd400,
        getDistanceSliderSnapPositions(config).map(({ x }) => new THREE.Vector3(x, y, z))
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

function createSnapMarkerGroup(color, positions) {
    const group = new THREE.Group();

    positions.forEach((position) => {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.075, 12, 12),
            new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0.45
            })
        );
        marker.position.copy(position);
        group.add(marker);
    });

    return group;
}
