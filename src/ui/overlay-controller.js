export class OverlayController {
    constructor({
        panelElement,
        toggleButtonElement,
        copyButtonElement,
        detailToggleElement,
        textElement,
        clipboardService,
        toastController
    }) {
        this.panelElement = panelElement;
        this.toggleButtonElement = toggleButtonElement;
        this.copyButtonElement = copyButtonElement;
        this.detailToggleElement = detailToggleElement;
        this.textElement = textElement;
        this.clipboardService = clipboardService;
        this.toastController = toastController;
        this.onDetailToggle = null;
        this.handleCopyClick = this.handleCopyClick.bind(this);
        this.handleDetailToggleChange = this.handleDetailToggleChange.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }

    setPrompt(text) {
        this.textElement.textContent = text;
    }

    isDetailedEnabled() {
        return this.detailToggleElement.checked;
    }

    attachCopy() {
        this.copyButtonElement.addEventListener("click", this.handleCopyClick);
    }

    attachPanelToggle() {
        this.toggleButtonElement.addEventListener("click", this.handleToggleClick);
        this.syncToggleState();
    }

    attachDetailToggle(onDetailToggle) {
        this.onDetailToggle = onDetailToggle;
        this.detailToggleElement.addEventListener("change", this.handleDetailToggleChange);
    }

    handleCopyClick() {
        this.clipboardService.copyText(this.textElement.textContent).then(() => {
            this.toastController.show();
        });
    }

    handleDetailToggleChange() {
        this.onDetailToggle?.(this.isDetailedEnabled());
    }

    handleToggleClick() {
        const isOpen = this.panelElement.classList.toggle("is-open");
        this.toggleButtonElement.setAttribute("aria-expanded", String(isOpen));
    }

    syncToggleState() {
        this.toggleButtonElement.setAttribute(
            "aria-expanded",
            String(this.panelElement.classList.contains("is-open"))
        );
    }
}
