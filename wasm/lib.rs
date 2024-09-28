#![feature(portable_simd)]
use std::simd::f32x4;

#[no_mangle]
pub fn initialize() {}

#[no_mangle]
pub fn test(input: f32) -> *mut [f32; 4] {
    let a = f32x4::splat(input);
    let b = f32x4::from_array([1.1, 2.0, 3.0, 4.0]);
    Box::into_raw(Box::new((a + b).to_array()))
}

/// # Safety
#[no_mangle]
pub unsafe fn drop(ptr: *mut u32) {
    unsafe {
        let _ = Box::from_raw(ptr);
    }
}
