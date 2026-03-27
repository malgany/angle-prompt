export class OverlayController {
    constructor({ overlayElement, textElement, clipboardService, toastController }) {
        this.overlayElement = overlayElement;
        this.textElement = textElement;
        this.clipboardService = clipboardService;
        this.toastController = toastController;
        this.handleCopyClick = this.handleCopyClick.bind(this);
    }

    setPrompt(text) {
        this.textElement.textContent = text;
    }

    attachCopy() {
        this.overlayElement.addEventListener("click", this.handleCopyClick);
    }

    handleCopyClick() {
        this.clipboardService.copyText(this.textElement.textContent).then(() => {
            this.toastController.show();
        });
    }
}
