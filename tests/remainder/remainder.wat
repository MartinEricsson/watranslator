(module
  ;; Function that calculates signed remainder (modulo)
  (func $remainder_signed (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.rem_s  ;; signed remainder
  )
  
  ;; Function that calculates unsigned remainder (modulo)
  (func $remainder_unsigned (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.rem_u  ;; unsigned remainder
  )
  
  ;; Export the functions
  (export "remainder_signed" (func $remainder_signed))
  (export "remainder_unsigned" (func $remainder_unsigned))
)