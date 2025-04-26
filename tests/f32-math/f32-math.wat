(module
  ;; Function to test f32.abs
  (func $abs_float (param $value f32) (result f32)
    local.get $value
    f32.abs
  )
  
  ;; Function to test f32.neg
  (func $neg_float (param $value f32) (result f32)
    local.get $value
    f32.neg
  )
  
  ;; Function to test f32.sqrt
  (func $sqrt_float (param $value f32) (result f32)
    local.get $value
    f32.sqrt
  )
  
  ;; Function to test f32.min
  (func $min_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.min
  )
  
  ;; Function to test f32.max
  (func $max_float (param $a f32) (param $b f32) (result f32)
    local.get $a
    local.get $b
    f32.max
  )
  
  ;; Function to test f32.ceil (round up to nearest integer)
  (func $ceil_float (param $value f32) (result f32)
    local.get $value
    f32.ceil
  )
  
  ;; Function to test f32.floor (round down to nearest integer)
  (func $floor_float (param $value f32) (result f32)
    local.get $value
    f32.floor
  )
  
  ;; Function to test f32.trunc (truncate toward zero)
  (func $trunc_float (param $value f32) (result f32)
    local.get $value
    f32.trunc
  )
  
  ;; Function to test f32.nearest (round to nearest integer)
  (func $nearest_float (param $value f32) (result f32)
    local.get $value
    f32.nearest
  )
  
  ;; Export all functions
  (export "abs" (func $abs_float))
  (export "neg" (func $neg_float))
  (export "sqrt" (func $sqrt_float))
  (export "min" (func $min_float))
  (export "max" (func $max_float))
  (export "ceil" (func $ceil_float))
  (export "floor" (func $floor_float))
  (export "trunc" (func $trunc_float))
  (export "nearest" (func $nearest_float))
)