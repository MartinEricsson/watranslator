(module
  ;; Function that performs f32 addition
  (func $add_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.add
  )
  
  ;; Function that performs f32 subtraction
  (func $subtract_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.sub
  )
  
  ;; Function that performs f32 multiplication
  (func $multiply_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.mul
  )
  
  ;; Function that performs f32 division
  (func $divide_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.div
  )
  
  ;; Function that uses f32.const to create constants
  (func $float_constants (result f32)
    f32.const 3.14159
    f32.const 2.71828
    f32.add  ;; pi + e
  )
  
  ;; Function that checks if f32 values are equal
  (func $equals_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.eq
  )
  
  ;; Function that checks if f32 values are not equal
  (func $not_equals_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.ne
  )
  
  ;; Function that checks if first f32 is less than second
  (func $less_than_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.lt
  )
  
  ;; Function that checks if first f32 is greater than second
  (func $greater_than_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.gt
  )
  
  ;; Function that checks if first f32 is less than or equal to second
  (func $less_equal_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.le
  )
  
  ;; Function that checks if first f32 is greater than or equal to second
  (func $greater_equal_float (param $a f32) (param $b f32) (result i32)
    local.get $a
    local.get $b
    f32.ge
  )
  
  ;; Function that performs f32.copysign operation
  (func $copysign_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.copysign
  )

  ;; Function tht performs f32.convert_i64_s
  (func $convert_i64_s (param $a i64) (result f32)
    local.get $a
    f32.convert_i64_s
  )

  ;; Function that performs f32.convert_i64_u 
  (func $convert_i64_u (param $a i64) (result f32)
    local.get $a
    f32.convert_i64_u
  )

  ;; F32_REINTERPRET_I32
  ;; Function that performs f32.reinterpret_i32
  (func $reinterpret_i32 (param $a i32) (result f32)
    local.get $a
    f32.reinterpret_i32
  )

  ;; F32_DEMOTE_F64
  ;; Function that performs f32.demote_f64
  (;func $demote_f64 (param $a f64) (result f32)
    local.get $a
    f32.demote_f64
  ;)
  
  ;; Export the functions
  (export "add_float" (func $add_float))
  (export "subtract_float" (func $subtract_float))
  (export "multiply_float" (func $multiply_float))
  (export "divide_float" (func $divide_float))
  (export "float_constants" (func $float_constants))
  
  ;; Export comparison functions
  (export "equals_float" (func $equals_float))
  (export "not_equals_float" (func $not_equals_float))
  (export "less_than_float" (func $less_than_float))
  (export "greater_than_float" (func $greater_than_float))
  (export "less_equal_float" (func $less_equal_float))
  (export "greater_equal_float" (func $greater_equal_float))
  (export "copysign_float" (func $copysign_float))
  (export "convert_i64_s" (func $convert_i64_s))
  (export "convert_i64_u" (func $convert_i64_u))
  (export "reinterpret_i32" (func $reinterpret_i32))
)