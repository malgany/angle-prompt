import { THREE } from "../vendor/three-context.js";

export class DragStateUpdater {
    constructor({ config, camera, cameraState }) {
        this.config = config;
        this.camera = camera;
        this.cameraState = cameraState;
        this.raycaster = new THREE.Raycaster();
        this.intersection = new THREE.Vector3();
    }

    update(dragSession, pointer) {
        this.raycaster.setFromCamera(pointer, this.camera);

        if (dragSession.type === "azimuth") {
            this.updateAzimuth();
            return;
        }

        this.updateElevation();
    }

    updateAzimuth() {
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, this.config.azimuthPlaneY, 0)
        );

        if (!this.raycaster.ray.intersectPlane(plane, this.intersection)) {
            return;
        }

        this.cameraState.setPartial({
            azimuth: THREE.MathUtils.radToDeg(Math.atan2(this.intersection.x, this.intersection.z))
        });
    }

    updateElevation() {
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(this.config.elevationPlaneX, 0, 0)
        );

        if (!this.raycaster.ray.intersectPlane(plane, this.intersection)) {
            return;
        }

        const relativeY = this.intersection.y - this.config.center.y;
        const relativeZ = this.intersection.z;

        this.cameraState.setPartial({
            elevation: THREE.MathUtils.radToDeg(Math.atan2(relativeY, relativeZ))
        });
    }
}
