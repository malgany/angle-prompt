import { THREE } from "../vendor/three-context.js";

export const AppConfig = Object.freeze({
    center: new THREE.Vector3(0, 0.75, 0),
    baseDistance: 1.6,
    azimuthRadius: 2.4,
    elevationRadius: 1.8,
    elevationPlaneX: -0.8,
    azimuthPlaneY: 0.05,
    distanceHandleOffset: 0.5,
    snapDurationMs: 250,
    snapSteps: Object.freeze({
        azimuth: Object.freeze([0, 45, 90, 135, 180, 225, 270, 315]),
        elevation: Object.freeze([-30, 0, 30, 60]),
        distance: Object.freeze([0.6, 1.0, 1.4])
    }),
    limits: Object.freeze({
        elevation: Object.freeze({ min: -30, max: 60 }),
        distance: Object.freeze({ min: 0.6, max: 1.4 })
    }),
    promptNames: Object.freeze({
        azimuth: Object.freeze({
            0: "front view",
            45: "front-right quarter view",
            90: "right side view",
            135: "back-right quarter view",
            180: "back view",
            225: "back-left quarter view",
            270: "left side view",
            315: "front-left quarter view"
        }),
        elevation: Object.freeze({
            "-30": "low-angle shot",
            "0": "eye-level shot",
            "30": "elevated shot",
            "60": "high-angle shot"
        }),
        distance: Object.freeze({
            "0.6": "close-up",
            "1.0": "medium shot",
            "1.4": "wide shot"
        })
    })
});
