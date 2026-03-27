const THREE = globalThis.THREE;

if (!THREE) {
    throw new Error("Three.js nao foi carregado.");
}

export { THREE };
