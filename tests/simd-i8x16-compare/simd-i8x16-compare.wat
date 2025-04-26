(module
  (memory 1)
  (export "memory" (memory 0))

  ;; Test i8x16.eq - equal comparison
  (func (export "test_i8x16_eq") (result i32)
    ;; Vector 1: [10, 20, 30, 10, ...] (repeating pattern)
    v128.const i8x16 10 20 30 10 20 30 10 20 30 10 20 30 10 20 30 10
    ;; Vector 2: [10, 10, 10, 10, ...] 
    v128.const i8x16 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
    ;; Compare for equality - should get true for positions 0, 3, 6, 9, 12, 15
    i8x16.eq
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.ne - not equal comparison
  (func (export "test_i8x16_ne") (result i32)
    v128.const i8x16 10 20 30 10 20 30 10 20 30 10 20 30 10 20 30 10
    v128.const i8x16 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10
    ;; Compare for inequality - should get true for positions 1, 2, 4, 5, 7, 8, etc.
    i8x16.ne
    ;; Extract lane to check result
    i8x16.extract_lane_s 1  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.lt_s - less than signed
  (func (export "test_i8x16_lt_s") (result i32)
    v128.const i8x16 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10
    v128.const i8x16 10 5 10 -5 10 5 10 -5 10 5 10 -5 10 5 10 -5
    ;; Less than signed comparison
    i8x16.lt_s
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.lt_u - less than unsigned
  (func (export "test_i8x16_lt_u") (result i32)
    ;; Including value 250 which is large when interpreted as unsigned
    v128.const i8x16 5 250 15 20 5 250 15 20 5 250 15 20 5 250 15 20
    v128.const i8x16 10 10 20 15 10 10 20 15 10 10 20 15 10 10 20 15
    ;; Less than unsigned comparison
    i8x16.lt_u
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.gt_s - greater than signed
  (func (export "test_i8x16_gt_s") (result i32)
    v128.const i8x16 10 5 10 -5 10 5 10 -5 10 5 10 -5 10 5 10 -5
    v128.const i8x16 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10
    ;; Greater than signed comparison
    i8x16.gt_s
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.gt_u - greater than unsigned
  (func (export "test_i8x16_gt_u") (result i32)
    ;; 250 is large when interpreted as unsigned
    v128.const i8x16 10 10 20 15 10 10 20 15 10 10 20 15 10 10 20 15
    v128.const i8x16 5 250 15 20 5 250 15 20 5 250 15 20 5 250 15 20
    ;; Greater than unsigned comparison
    i8x16.gt_u
    ;; Extract lane to check result
    i8x16.extract_lane_s 1  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.le_s - less than or equal signed
  (func (export "test_i8x16_le_s") (result i32)
    v128.const i8x16 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10
    v128.const i8x16 10 10 10 -5 10 10 10 -5 10 10 10 -5 10 10 10 -5
    ;; Less than or equal signed comparison
    i8x16.le_s
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.le_u - less than or equal unsigned
  (func (export "test_i8x16_le_u") (result i32)
    v128.const i8x16 5 10 15 20 5 10 15 20 5 10 15 20 5 10 15 20
    v128.const i8x16 10 10 20 20 10 10 20 20 10 10 20 20 10 10 20 20
    ;; Less than or equal unsigned comparison
    i8x16.le_u
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.ge_s - greater than or equal signed
  (func (export "test_i8x16_ge_s") (result i32)
    v128.const i8x16 10 10 10 -5 10 10 10 -5 10 10 10 -5 10 10 10 -5
    v128.const i8x16 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10 5 10 -5 -10
    ;; Greater than or equal signed comparison
    i8x16.ge_s
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )

  ;; Test i8x16.ge_u - greater than or equal unsigned
  (func (export "test_i8x16_ge_u") (result i32)
    ;; 250 is large when interpreted as unsigned
    v128.const i8x16 10 250 20 20 10 250 20 20 10 250 20 20 10 250 20 20
    v128.const i8x16 10 10 15 20 10 10 15 20 10 10 15 20 10 10 15 20
    ;; Greater than or equal unsigned comparison
    i8x16.ge_u
    ;; Extract lane to check result
    i8x16.extract_lane_s 0  ;; Should be -1 (true in SIMD)
  )
)
