# Hello SIMD WebAssembly

## Setup

    rustup update -- nightly
    rustup target add wasm32-wasip1
    pacman -S binaryen

## Development

    ./build.sh
    pnpm test:dev

## Debug

    wasm-dis dist/main.wasm

## References

- https://surma.dev/things/rust-to-webassembly/
- https://nickb.dev/blog/authoring-a-simd-enhanced-wasm-library-with-rust/
- https://rustwasm.github.io/book/reference/code-size.html
- https://book.leptos.dev/deployment/binary_size.html
- https://github.com/rust-lang/portable-simd
