(module
  ;; Function to test i32.eq (equal)
  (func $testEq (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.eq
  )

  ;; Function to test i32.ne (not equal)
  (func $testNe (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.ne
  )

  ;; Function to test i32.ge_s (signed greater than or equal)
  (func $testGeS (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.ge_s
  )

  ;; Function to test i32.ge_u (unsigned greater than or equal)
  (func $testGeU (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.ge_u
  )

  ;; Function to test i32.lt_u (unsigned less than)
  (func $testLtU (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.lt_u
  )
  
  ;; Function to test i32.gt_u (unsigned greater than)
  (func $testGtU (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.gt_u
  )

  ;; Function to test i32.le_u (unsigned less than or equal)
  (func $testLeU (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.le_u
  )

  (func $testEqz (param $a i32) (result i32)
    local.get $a
    i32.eqz
  )

  ;; Export all functions
  (export "eq" (func $testEq))
  (export "ne" (func $testNe))
  (export "ge_s" (func $testGeS))
  (export "ge_u" (func $testGeU))
  (export "lt_u" (func $testLtU))
  (export "gt_u" (func $testGtU))
  (export "le_u" (func $testLeU))
  (export "eqz" (func $testEqz))
)