(module
  ;; Import memory
  (memory (export "memory") 1)

  ;; Test i64x2.eq
  (func (export "test_i64x2_eq_true") (result i32)
    ;; Create two identical vectors [1n, 2n] and check if they're equal
    v128.const i64x2 1 2
    v128.const i64x2 1 2
    i64x2.eq
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_eq_false") (result i32)
    ;; Create two different vectors and check if they're equal
    v128.const i64x2 1 2
    v128.const i64x2 3 2
    i64x2.eq
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test i64x2.ne
  (func (export "test_i64x2_ne_true") (result i32)
    ;; Create two different vectors and check if they're not equal
    v128.const i64x2 1 2
    v128.const i64x2 3 2
    i64x2.ne
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_ne_false") (result i32)
    ;; Create two identical vectors and check if they're not equal
    v128.const i64x2 1 2
    v128.const i64x2 1 2
    i64x2.ne
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test i64x2.lt_s
  (func (export "test_i64x2_lt_s_true") (result i32)
    ;; Create two vectors and check if first is less than second
    v128.const i64x2 1 2
    v128.const i64x2 2 3
    i64x2.lt_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_lt_s_false") (result i32)
    ;; Create two vectors and check if first is less than second
    v128.const i64x2 3 4
    v128.const i64x2 2 3
    i64x2.lt_s
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test i64x2.gt_s
  (func (export "test_i64x2_gt_s_true") (result i32)
    ;; Create two vectors and check if first is greater than second
    v128.const i64x2 3 4
    v128.const i64x2 2 3
    i64x2.gt_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_gt_s_false") (result i32)
    ;; Create two vectors and check if first is greater than second
    v128.const i64x2 1 2
    v128.const i64x2 2 3
    i64x2.gt_s
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test i64x2.le_s
  (func (export "test_i64x2_le_s_true_lt") (result i32)
    ;; Create two vectors and check if first is less than or equal to second
    v128.const i64x2 1 2
    v128.const i64x2 2 3
    i64x2.le_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_le_s_true_eq") (result i32)
    ;; Create two equal vectors and check if first is less than or equal to second
    v128.const i64x2 2 3
    v128.const i64x2 2 3
    i64x2.le_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_le_s_false") (result i32)
    ;; Create two vectors and check if first is less than or equal to second
    v128.const i64x2 3 4
    v128.const i64x2 2 3
    i64x2.le_s
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test i64x2.ge_s
  (func (export "test_i64x2_ge_s_true_gt") (result i32)
    ;; Create two vectors and check if first is greater than or equal to second
    v128.const i64x2 3 4
    v128.const i64x2 2 3
    i64x2.ge_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_ge_s_true_eq") (result i32)
    ;; Create two equal vectors and check if first is greater than or equal to second
    v128.const i64x2 2 3
    v128.const i64x2 2 3
    i64x2.ge_s
    ;; Extract the first lane (should be -1 for true)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  (func (export "test_i64x2_ge_s_false") (result i32)
    ;; Create two vectors and check if first is greater than or equal to second
    v128.const i64x2 1 2
    v128.const i64x2 2 3
    i64x2.ge_s
    ;; Extract the first lane (should be 0 for false)
    i64x2.extract_lane 0
    ;; Convert to i32 to return
    i32.wrap_i64
  )

  ;; Test with negative numbers for signed comparisons
  (func (export "test_i64x2_signed_comparison") (result i64)
    ;; Create vector with negative and positive numbers
    v128.const i64x2 -10 10
    v128.const i64x2 10 -10
    ;; Test lt_s (first lane: -10 < 10 = true, second lane: 10 < -10 = false)
    i64x2.lt_s
    ;; Extract first lane which should be -1 (true) and return it
    i64x2.extract_lane 0
  )
)
