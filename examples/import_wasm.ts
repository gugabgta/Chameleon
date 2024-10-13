const { instance, module } = await WebAssembly.instantiateStreaming(
    fetch(import.meta.resolve("./wasm/pkg/chameleon_wasm_bg.wasm")),
);
const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
