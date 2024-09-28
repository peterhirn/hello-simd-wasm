# Hello SIMD WebAssembly

## Setup

    rustup update -- nightly
    rustup target add wasm32-unknown-unknown

[Binaryen](https://github.com/WebAssembly/binaryen)

    sudo pacman -S binaryen

## Debug

    ./build.sh
    wasm-dis dist/main.wasm

Output

    (module
    (type $0 (func (param i32)))
    (type $1 (func (param i32 f32)))
    (import "env" "memory" (memory $mimport$0 256 16384 shared))
    (global $global$0 (mut i32) (i32.const 0))
    (global $global$1 i32 (i32.const 0))
    (global $global$2 i32 (i32.const 0))
    (global $global$3 i32 (i32.const 1048576))
    (global $global$4 i32 (i32.const 1048576))
    (export "__tls_base" (global $global$0))
    (export "__tls_size" (global $global$1))
    (export "__tls_align" (global $global$2))
    (export "__wasm_init_tls" (func $0))
    (export "foo" (func $1))
    (export "__data_end" (global $global$3))
    (export "__heap_base" (global $global$4))
    (func $0 (param $0 i32)
    )
    (func $1 (param $0 i32) (param $1 f32)
      (v128.store align=4
      (local.get $0)
      (f32x4.add
        (f32x4.splat
        (local.get $1)
        )
        (v128.const i32x4 0x3f800000 0x40000000 0x40400000 0x40800000)
      )
      )
    )
    ;; custom section "producers", size 59
    ;; features section: threads, mutable-globals, simd, bulk-memory, sign-ext, reference-types, multivalue
    )

## References

- https://surma.dev/things/rust-to-webassembly/
- https://nickb.dev/blog/authoring-a-simd-enhanced-wasm-library-with-rust/
- https://rustwasm.github.io/book/reference/code-size.html
- https://book.leptos.dev/deployment/binary_size.html
- https://github.com/rust-lang/portable-simd
