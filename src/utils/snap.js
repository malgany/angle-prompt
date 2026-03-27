export function snapToNearest(value, steps) {
    return steps.reduce((previous, current) =>
        Math.abs(current - value) < Math.abs(previous - value) ? current : previous
    );
}
