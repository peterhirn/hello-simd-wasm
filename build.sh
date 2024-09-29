#!/usr/bin/env sh
set -eu

TARGET=target/wasm32-wasip1/release/hello_simd_wasm.wasm

cargo build --release

mkdir -p dist

wasm-opt -O3 \
  --enable-simd \
  --enable-bulk-memory \
  --enable-multivalue \
  -o dist/main.wasm \
  ${TARGET}

sha1sum ${TARGET}
stat -c "%n %s" ${TARGET}

sha1sum dist/main.wasm
stat -c "%n %s" dist/main.wasm
