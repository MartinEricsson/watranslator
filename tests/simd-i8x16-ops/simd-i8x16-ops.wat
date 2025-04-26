(module
  (memory 1)
  (export "memory" (memory 0))

  ;; Test i8x16.abs - absolute value
  (func (export "test_i8x16_abs") (result i32)
    v128.const i8x16 -5 10 -15 20 -25 30 -35 40 -45 50 -55 60 -65 70 -75 80
    i8x16.abs
    i8x16.extract_lane_s 0  ;; Should be 5
  )

  ;; Test i8x16.neg - negation
  (func (export "test_i8x16_neg") (result i32)
    v128.const i8x16 5 -10 15 -20 25 -30 35 -40 45 -50 55 -60 65 -70 75 -80
    i8x16.neg
    i8x16.extract_lane_s 0  ;; Should be -5
  )

  ;; Test i8x16.popcnt - population count
  (func (export "test_i8x16_popcnt") (result i32)
    v128.const i8x16 0 1 3 7 15 31 63 127 255 254 252 248 240 224 192 128
    i8x16.popcnt
    i8x16.extract_lane_s 1  ;; Should be 1 (number of bits set in 1)
  )

  ;; Test i8x16.all_true - all true
  (func (export "test_i8x16_all_true") (result i32)
    ;; All non-zero (true)
    v128.const i8x16 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
    i8x16.all_true
  )

  ;; Test i8x16.bitmask - bitmask
  (func (export "test_i8x16_bitmask") (result i32)
    ;; First and third lanes are negative, rest are positive
    v128.const i8x16 -1 1 -1 1 1 1 1 1 1 1 1 1 1 1 1 1
    i8x16.bitmask  ;; Should be 5 (binary: 0000 0000 0000 0101)
  )

  ;; Test i8x16.narrow_i16x8_s - narrow with signed saturation
  (func (export "test_i8x16_narrow_i16x8_s") (result i32)
    ;; Values outside i8 range will be saturated
    v128.const i16x8 -200 200 -128 127 0 32767 -32768 100
    v128.const i16x8 50 -100 127 -128 32767 -32768 0 0
    i8x16.narrow_i16x8_s
    i8x16.extract_lane_s 0  ;; Should be -128 (saturated from -200)
  )

  ;; Test i8x16.narrow_i16x8_u - narrow with unsigned saturation
  (func (export "test_i8x16_narrow_i16x8_u") (result i32)
    ;; Values outside u8 range will be saturated
    v128.const i16x8 -200 200 300 127 0 32767 -32768 100
    v128.const i16x8 50 -100 127 -128 32767 -32768 300 0
    i8x16.narrow_i16x8_u
    i8x16.extract_lane_u 1  ;; Should be 200 (within u8 range)
  )

  ;; Test i8x16.shl - shift left
  (func (export "test_i8x16_shl") (result i32)
    v128.const i8x16 1 2 4 8 16 32 64 -128 1 2 4 8 16 32 64 -128
    i32.const 2  ;; Shift by 2
    i8x16.shl
    i8x16.extract_lane_s 0  ;; Should be 4 (1 << 2)
  )

  ;; Test i8x16.shr_s - shift right signed
  (func (export "test_i8x16_shr_s") (result i32)
    v128.const i8x16 -128 64 32 16 8 4 2 1 -128 64 32 16 8 4 2 1
    i32.const 1  ;; Shift by 1
    i8x16.shr_s
    i8x16.extract_lane_s 0  ;; Should be -64 (-128 >> 1, sign extended)
  )

  ;; Test i8x16.shr_u - shift right unsigned
  (func (export "test_i8x16_shr_u") (result i32)
    v128.const i8x16 -128 64 32 16 8 4 2 1 -128 64 32 16 8 4 2 1
    i32.const 1  ;; Shift by 1
    i8x16.shr_u
    i8x16.extract_lane_s 0  ;; Should be 64 (-128 >> 1, zero extended)
  )

  ;; Test i8x16.add - addition
  (func (export "test_i8x16_add") (result i32)
    v128.const i8x16 10 20 30 40 50 60 70 80 90 100 110 120 -10 -20 -30 -40
    v128.const i8x16 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80
    i8x16.add
    i8x16.extract_lane_s 0  ;; Should be 15 (10 + 5)
  )

  ;; Test i8x16.add_sat_s - saturating addition signed
  (func (export "test_i8x16_add_sat_s") (result i32)
    v128.const i8x16 100 120 -100 -120 100 120 -100 -120 100 120 -100 -120 100 120 -100 -120
    v128.const i8x16 50 10 -50 -10 50 10 -50 -10 50 10 -50 -10 50 10 -50 -10
    i8x16.add_sat_s
    i8x16.extract_lane_s 0  ;; Should be 127 (saturated from 150)
  )

  ;; Test i8x16.add_sat_u - saturating addition unsigned
  (func (export "test_i8x16_add_sat_u") (result i32)
    v128.const i8x16 200 220 100 50 200 220 100 50 200 220 100 50 200 220 100 50
    v128.const i8x16 100 50 200 220 100 50 200 220 100 50 200 220 100 50 200 220
    i8x16.add_sat_u
    i8x16.extract_lane_s 0  ;; Should be -1 (255 in unsigned, saturated from 300)
  )

  ;; Test i8x16.sub - subtraction
  (func (export "test_i8x16_sub") (result i32)
    v128.const i8x16 20 30 40 50 60 70 80 90 100 110 120 -10 -20 -30 -40 -50
    v128.const i8x16 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80
    i8x16.sub
    i8x16.extract_lane_s 0  ;; Should be 15 (20 - 5)
  )

  ;; Test i8x16.sub_sat_s - saturating subtraction signed
  (func (export "test_i8x16_sub_sat_s") (result i32)
    v128.const i8x16 -100 -120 100 120 -100 -120 100 120 -100 -120 100 120 -100 -120 100 120
    v128.const i8x16 50 10 -50 -10 50 10 -50 -10 50 10 -50 -10 50 10 -50 -10
    i8x16.sub_sat_s
    i8x16.extract_lane_s 0  ;; Should be -128 (saturated from -150)
  )

  ;; Test i8x16.sub_sat_u - saturating subtraction unsigned
  (func (export "test_i8x16_sub_sat_u") (result i32)
    v128.const i8x16 50 100 200 250 50 100 200 250 50 100 200 250 50 100 200 250
    v128.const i8x16 100 50 50 100 100 50 50 100 100 50 50 100 100 50 50 100
    i8x16.sub_sat_u
    i8x16.extract_lane_s 0  ;; Should be 0 (saturated from -50)
  )

  ;; Test i8x16.min_s - minimum signed
  (func (export "test_i8x16_min_s") (result i32)
    v128.const i8x16 -10 20 -30 40 -50 60 -70 80 -90 100 -110 120 -127 -1 0 1
    v128.const i8x16 10 -20 30 -40 50 -60 70 -80 90 -100 110 -120 -128 0 0 0
    i8x16.min_s
    i8x16.extract_lane_s 0  ;; Should be -10
  )

  ;; Test i8x16.min_u - minimum unsigned
  (func (export "test_i8x16_min_u") (result i32)
    v128.const i8x16 -10 20 -30 40 -50 60 -70 80 -90 100 -110 120 -127 -1 0 1
    v128.const i8x16 10 -20 30 -40 50 -60 70 -80 90 -100 110 -120 -128 0 0 0
    i8x16.min_u
    i8x16.extract_lane_s 0  ;; Should be 10 (as -10 is treated as large unsigned value)
  )

  ;; Test i8x16.max_s - maximum signed
  (func (export "test_i8x16_max_s") (result i32)
    v128.const i8x16 -10 20 -30 40 -50 60 -70 80 -90 100 -110 120 -127 -1 0 1
    v128.const i8x16 10 -20 30 -40 50 -60 70 -80 90 -100 110 -120 -128 0 0 0
    i8x16.max_s
    i8x16.extract_lane_s 0  ;; Should be 10
  )

  ;; Test i8x16.max_u - maximum unsigned
  (func (export "test_i8x16_max_u") (result i32)
    v128.const i8x16 -10 20 -30 40 -50 60 -70 80 -90 100 -110 120 -127 -1 0 1
    v128.const i8x16 10 -20 30 -40 50 -60 70 -80 90 -100 110 -120 -128 0 0 0
    i8x16.max_u
    i8x16.extract_lane_s 0  ;; Should be -10 (as -10 is treated as large unsigned value)
  )

  ;; Test i8x16.avgr_u - average rounded unsigned
  (func (export "test_i8x16_avgr_u") (result i32)
    v128.const i8x16 10 20 30 40 50 60 70 80 90 100 110 120 -10 -20 -30 -40
    v128.const i8x16 20 30 40 50 60 70 80 90 100 110 120 130 -20 -30 -40 -50
    i8x16.avgr_u
    i8x16.extract_lane_s 0  ;; Should be 15 ((10 + 20) / 2)
  )
)
