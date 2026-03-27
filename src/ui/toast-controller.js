export class ToastController {
    constructor(toastElement) {
        this.toastElement = toastElement;
        this.timeoutId = null;
    }

    show(durationMs = 2000) {
        this.toastElement.style.opacity = "1";
        window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(() => {
            this.hide();
        }, durationMs);
    }

    hide() {
        this.toastElement.style.opacity = "0";
    }
}
