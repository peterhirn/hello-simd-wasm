#![feature(portable_simd)]
use std::{alloc::Layout, simd::f32x4};

/// # Safety
#[no_mangle]
pub unsafe fn alloc(length: usize) -> *mut u8 {
    let layout = Layout::array::<u8>(length).unwrap();
    std::alloc::alloc(layout)
}

/// # Safety
#[no_mangle]
pub unsafe fn drop(ptr: *mut u32) {
    let _ = Box::from_raw(ptr);
}

#[no_mangle]
pub fn simd(input: f32) -> *mut [f32; 4] {
    let a = f32x4::splat(input);
    let b = f32x4::from_array([1.0, 2.0, 3.0, 4.0]);
    Box::into_raw(Box::new((a + b).to_array()))
}
