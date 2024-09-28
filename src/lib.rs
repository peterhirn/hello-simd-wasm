#![feature(portable_simd)]
use std::simd::f32x4;

#[no_mangle]
pub fn foo(input: f32) -> [f32; 4] {
    let a = f32x4::splat(input);
    let b = f32x4::from_array([1.0, 2.0, 3.0, 4.0]);
    (a + b).to_array()
}
