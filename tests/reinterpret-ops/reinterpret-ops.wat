(module
  ;; i32.reinterpret_f32 tests
  (func $i32_reinterpret_f32 (param $value f32) (result i32)
    local.get $value
    i32.reinterpret_f32
  )
  
  (func $f32_to_i32_zero (result i32)
    f32.const 0.0
    i32.reinterpret_f32
  )
  
  (func $f32_to_i32_one (result i32)
    f32.const 1.0
    i32.reinterpret_f32
  )
  
  (func $f32_to_i32_neg_one (result i32)
    f32.const -1.0
    i32.reinterpret_f32
  )
  
  ;; f32.reinterpret_i32 tests
  (func $f32_reinterpret_i32 (param $value i32) (result f32)
    local.get $value
    f32.reinterpret_i32
  )
  
  (func $i32_to_f32_zero (result f32)
    i32.const 0x00000000
    f32.reinterpret_i32
  )
  
  (func $i32_to_f32_one (result f32)
    i32.const 0x3F800000
    f32.reinterpret_i32
  )
  
  (func $i32_to_f32_neg_one (result f32)
    i32.const 0xBF800000
    f32.reinterpret_i32
  )
  
  (func $i32_to_f32_infinity (result f32)
    i32.const 0x7F800000
    f32.reinterpret_i32
  )
  
  (func $i32_to_f32_neg_infinity (result f32)
    i32.const 0xFF800000
    f32.reinterpret_i32
  )
  
  ;; f64.reinterpret_i64 tests
  (func $f64_reinterpret_i64 (param $value i64) (result f64)
    local.get $value
    f64.reinterpret_i64
  )
  
  (func $i64_to_f64_zero (result f64)
    i64.const 0x0000000000000000
    f64.reinterpret_i64
  )
  
  (func $i64_to_f64_one (result f64)
    i64.const 0x3FF0000000000000
    f64.reinterpret_i64
  )
  
  (func $i64_to_f64_neg_one (result f64)
    i64.const 0xBFF0000000000000
    f64.reinterpret_i64
  )
  
  (func $i64_to_f64_infinity (result f64)
    i64.const 0x7FF0000000000000
    f64.reinterpret_i64
  )
  
  (func $i64_to_f64_neg_infinity (result f64)
    i64.const 0xFFF0000000000000
    f64.reinterpret_i64
  )
  
  ;; Round-trip tests for i32 <-> f32
  (func $roundtrip_f32_to_i32_to_f32 (param $value f32) (result i32)
    local.get $value
    i32.reinterpret_f32
    f32.reinterpret_i32
    i32.reinterpret_f32
  )
  
  (func $roundtrip_i32_to_f32_to_i32 (param $value i32) (result i32)
    local.get $value
    f32.reinterpret_i32
    i32.reinterpret_f32
  )
  
  ;; Round-trip tests for i64 <-> f64
  (func $roundtrip_f64_to_i64_to_f64 (param $value f64) (result i64)
    local.get $value
    i64.reinterpret_f64
    f64.reinterpret_i64
    i64.reinterpret_f64
  )
  
  (func $roundtrip_i64_to_f64_to_i64 (param $value i64) (result i64)
    local.get $value
    f64.reinterpret_i64
    i64.reinterpret_f64
  )
  
  ;; Export functions
  (export "i32_reinterpret_f32" (func $i32_reinterpret_f32))
  (export "f32_to_i32_zero" (func $f32_to_i32_zero))
  (export "f32_to_i32_one" (func $f32_to_i32_one))
  (export "f32_to_i32_neg_one" (func $f32_to_i32_neg_one))
  (export "f32_reinterpret_i32" (func $f32_reinterpret_i32))
  (export "i32_to_f32_zero" (func $i32_to_f32_zero))
  (export "i32_to_f32_one" (func $i32_to_f32_one))
  (export "i32_to_f32_neg_one" (func $i32_to_f32_neg_one))
  (export "i32_to_f32_infinity" (func $i32_to_f32_infinity))
  (export "i32_to_f32_neg_infinity" (func $i32_to_f32_neg_infinity))
  (export "f64_reinterpret_i64" (func $f64_reinterpret_i64))
  (export "i64_to_f64_zero" (func $i64_to_f64_zero))
  (export "i64_to_f64_one" (func $i64_to_f64_one))
  (export "i64_to_f64_neg_one" (func $i64_to_f64_neg_one))
  (export "i64_to_f64_infinity" (func $i64_to_f64_infinity))
  (export "i64_to_f64_neg_infinity" (func $i64_to_f64_neg_infinity))
  (export "roundtrip_f32_to_i32_to_f32" (func $roundtrip_f32_to_i32_to_f32))
  (export "roundtrip_i32_to_f32_to_i32" (func $roundtrip_i32_to_f32_to_i32))
  (export "roundtrip_f64_to_i64_to_f64" (func $roundtrip_f64_to_i64_to_f64))
  (export "roundtrip_i64_to_f64_to_i64" (func $roundtrip_i64_to_f64_to_i64))
)
