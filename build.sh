#!/usr/bin/env sh
set -eu

cargo build --release

mkdir -p dist

wasm-opt -O3 \
  --enable-simd \
  --enable-bulk-memory \
  -o dist/main.wasm \
  target/wasm32-wasip1/release/hello_simd_wasm.wasm

sha1sum target/wasm32-wasip1/release/hello_simd_wasm.wasm
stat -c "%n %s" target/wasm32-wasip1/release/hello_simd_wasm.wasm

sha1sum dist/main.wasm
stat -c "%n %s" dist/main.wasm
