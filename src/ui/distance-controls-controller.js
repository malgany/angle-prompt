export class DistanceControlsController {
    constructor({ buttonElements, onSelectDistance }) {
        this.buttonElements = buttonElements;
        this.onSelectDistance = onSelectDistance;
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    attach() {
        this.buttonElements.forEach((buttonElement) => {
            buttonElement.addEventListener("click", this.handleButtonClick);
        });
    }

    setActiveDistance(distanceFactor) {
        const activeKey = this.getDistanceKey(distanceFactor);

        this.buttonElements.forEach((buttonElement) => {
            const isActive = this.getDistanceKey(Number(buttonElement.dataset.distanceFactor)) === activeKey;
            buttonElement.classList.toggle("is-active", isActive);
            buttonElement.setAttribute("aria-pressed", String(isActive));
        });
    }

    handleButtonClick(event) {
        this.onSelectDistance(Number(event.currentTarget.dataset.distanceFactor));
    }

    getDistanceKey(distanceFactor) {
        return distanceFactor === 1 ? "1.0" : distanceFactor.toFixed(1);
    }
}
