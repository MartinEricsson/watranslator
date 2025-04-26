(module
  ;; Function that performs signed division
  (func $divide_signed (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s  ;; signed division
  )
  
  ;; Function that performs unsigned division
  (func $divide_unsigned (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_u  ;; unsigned division
  )
  
  ;; Export the functions
  (export "divide_signed" (func $divide_signed))
  (export "divide_unsigned" (func $divide_unsigned))
)