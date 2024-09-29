#![feature(portable_simd)]
use std::{alloc::Layout, simd::f32x4};

/// # Safety
#[no_mangle]
pub unsafe fn alloc(size: u32) -> *mut u8 {
    let layout = Layout::array::<u8>(size as usize).unwrap();
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

#[no_mangle]
pub fn multivalue(input: u32) -> (u32, u32) {
    (input, input + 1)
}

#[no_mangle]
pub fn flip(a: u32, b: u32) -> (u32, u32) {
    (b, a)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = flip(1, 2);
        assert_eq!(result, (2, 1));
    }
}
