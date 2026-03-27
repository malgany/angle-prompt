export class ClipboardService {
    copyText(text) {
        return navigator.clipboard.writeText(text);
    }
}
