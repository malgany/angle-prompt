import { THREE } from "../vendor/three-context.js";

export class SceneController {
    constructor({ config, sceneObjects, handleVisualController }) {
        this.config = config;
        this.sceneObjects = sceneObjects;
        this.handleVisualController = handleVisualController;
    }

    render(cameraState) {
        const rawState = cameraState.getRaw();
        const pose = this.createPose(rawState);

        this.renderCameraGroup(pose.cameraPosition);
        this.renderAzimuthHandle(pose.azimuthRadians);
        this.renderElevationHandle(pose.elevationRadians);
        this.renderDistanceControls(pose);
    }

    getInteractiveHandles() {
        return this.handleVisualController.getHandles();
    }

    resetHandleVisuals() {
        this.handleVisualController.reset();
    }

    activateHandle(type, scale) {
        this.handleVisualController.activate(type, scale);
    }

    deactivateHandle(type) {
        this.handleVisualController.deactivate(type);
    }

    createPose(rawState) {
        const distance = this.config.baseDistance * rawState.distanceFactor;
        const azimuthRadians = THREE.MathUtils.degToRad(rawState.azimuth);
        const elevationRadians = THREE.MathUtils.degToRad(rawState.elevation);

        return {
            distance,
            azimuthRadians,
            elevationRadians,
            cameraPosition: new THREE.Vector3(
                distance * Math.sin(azimuthRadians) * Math.cos(elevationRadians),
                distance * Math.sin(elevationRadians) + this.config.center.y,
                distance * Math.cos(azimuthRadians) * Math.cos(elevationRadians)
            )
        };
    }

    renderCameraGroup(cameraPosition) {
        this.sceneObjects.cameraGroup.position.copy(cameraPosition);
        this.sceneObjects.cameraGroup.lookAt(this.config.center);
    }

    renderAzimuthHandle(azimuthRadians) {
        this.sceneObjects.azimuthHandle.position.set(
            this.config.azimuthRadius * Math.sin(azimuthRadians),
            this.config.azimuthPlaneY,
            this.config.azimuthRadius * Math.cos(azimuthRadians)
        );
    }

    renderElevationHandle(elevationRadians) {
        this.sceneObjects.elevationHandle.position.set(
            this.config.elevationPlaneX,
            this.config.elevationRadius * Math.sin(elevationRadians) + this.config.center.y,
            this.config.elevationRadius * Math.cos(elevationRadians)
        );
    }

    renderDistanceControls(pose) {
        this.sceneObjects.distanceLineGeometry.setFromPoints([
            pose.cameraPosition.clone(),
            this.config.center.clone()
        ]);
    }
}
