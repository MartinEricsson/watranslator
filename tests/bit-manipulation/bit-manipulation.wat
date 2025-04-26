(module
  ;; Function to test i32.and
  (func $testAnd (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.and
  )

  ;; Function to test i32.or
  (func $testOr (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.or
  )

  ;; Function to test i32.xor
  (func $testXor (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.xor
  )

  ;; Function to test i32.shl (shift left)
  (func $testShl (param $value i32) (param $shift i32) (result i32)
    local.get $value
    local.get $shift
    i32.shl
  )

  ;; Function to test i32.shr_s (arithmetic shift right - signed)
  (func $testShrS (param $value i32) (param $shift i32) (result i32)
    local.get $value
    local.get $shift
    i32.shr_s
  )

  ;; Function to test i32.shr_u (logical shift right - unsigned)
  (func $testShrU (param $value i32) (param $shift i32) (result i32)
    local.get $value
    local.get $shift
    i32.shr_u
  )

  (func $testRotl (param $value i32) (param $shift i32) (result i32)
    local.get $value
    local.get $shift
    i32.rotl
  )
  (func $testRotr (param $value i32) (param $shift i32) (result i32)
    local.get $value
    local.get $shift
    i32.rotr
  )

  ;; Export all functions
  (export "and" (func $testAnd))
  (export "or" (func $testOr))
  (export "xor" (func $testXor))
  (export "shl" (func $testShl))
  (export "shr_s" (func $testShrS))
  (export "shr_u" (func $testShrU))
  (export "rotl" (func $testRotl))
  (export "rotr" (func $testRotr))
)