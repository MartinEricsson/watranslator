(module
  ;; Import the function to print results for testing
  (import "console" "log" (func $log (param i32)))

  ;; Memory for our test vectors
  (memory 1)

  ;; Function to test i32x4.eq
  (func $test_i32x4_eq (export "test_i32x4_eq") (result i32) (local v128)
    ;; Define test vectors
    v128.const i32x4 10 20 30 40  ;; a
    v128.const i32x4 10 25 30 45  ;; b
    ;; Compare for equality
    i32x4.eq
    ;; Extract results and combine into a single i32
    local.tee 0  ;; Store result in local 0 and keep a copy on stack
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + 0 + -1 + 0 = -2 (where -1 is 0xFFFFFFFF for true)
  )

  ;; Function to test i32x4.ne
  (func $test_i32x4_ne (export "test_i32x4_ne") (result i32) (local v128)
    v128.const i32x4 10 20 30 40  ;; a
    v128.const i32x4 10 25 30 45  ;; b
    i32x4.ne
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be 0 + -1 + 0 + -1 = -2
  )

  ;; Function to test i32x4.lt_s
  (func $test_i32x4_lt_s (export "test_i32x4_lt_s") (result i32) (local v128)
    v128.const i32x4 10 20 -30 40
    v128.const i32x4 15 15 -15 50
    i32x4.lt_s
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + 0 + -1 + -1 = -3
  )

  ;; Function to test i32x4.lt_u
  (func $test_i32x4_lt_u (export "test_i32x4_lt_u") (result i32) (local v128)
    v128.const i32x4 10 20 -1 40  ;; -1 is max unsigned value
    v128.const i32x4 15 15 10 50
    i32x4.lt_u
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + 0 + 0 + -1 = -2
  )

  ;; Function to test i32x4.gt_s
  (func $test_i32x4_gt_s (export "test_i32x4_gt_s") (result i32) (local v128)
    v128.const i32x4 15 20 -15 40
    v128.const i32x4 10 15 -30 50
    i32x4.gt_s
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )

  ;; Function to test i32x4.gt_u
  (func $test_i32x4_gt_u (export "test_i32x4_gt_u") (result i32) (local v128)
    v128.const i32x4 15 20 -1 40  ;; -1 is max unsigned value
    v128.const i32x4 10 15 10 50
    i32x4.gt_u
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )

  ;; Function to test i32x4.le_s
  (func $test_i32x4_le_s (export "test_i32x4_le_s") (result i32) (local v128)
    v128.const i32x4 10 15 -30 50
    v128.const i32x4 15 15 -15 40
    i32x4.le_s
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )

  ;; Function to test i32x4.le_u
  (func $test_i32x4_le_u (export "test_i32x4_le_u") (result i32) (local v128)
    v128.const i32x4 10 15 100 50
    v128.const i32x4 15 15 -1 40  ;; -1 is max unsigned value
    i32x4.le_u
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )

  ;; Function to test i32x4.ge_s
  (func $test_i32x4_ge_s (export "test_i32x4_ge_s") (result i32) (local v128)
    v128.const i32x4 15 15 -15 40
    v128.const i32x4 10 15 -30 50
    i32x4.ge_s
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )

  ;; Function to test i32x4.ge_u
  (func $test_i32x4_ge_u (export "test_i32x4_ge_u") (result i32) (local v128)
    v128.const i32x4 15 15 -1 40  ;; -1 is max unsigned value 
    v128.const i32x4 10 15 100 50
    i32x4.ge_u
    ;; Extract results and combine
    local.tee 0
    i32x4.extract_lane 0
    local.get 0
    i32x4.extract_lane 1
    i32.add
    local.get 0
    i32x4.extract_lane 2
    i32.add
    local.get 0
    i32x4.extract_lane 3
    i32.add
    ;; Should be -1 + -1 + -1 + 0 = -3
  )
)
