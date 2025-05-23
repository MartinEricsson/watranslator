(module
  (func (export "i8x16_extract_lane_s_positive") (result i32)
    ;; Create a v128 constant with values -128 to 127
    v128.const i8x16 -128 -100 -75 -50 -25 -10 -5 -1 0 1 5 10 25 50 75 127
    
    ;; Extract the last lane as a signed int (should be 127)
    i8x16.extract_lane_s 15
  )

  (func (export "i8x16_extract_lane_s_negative") (result i32)
    ;; Create a v128 constant with values -128 to 127
    v128.const i8x16 -128 -100 -75 -50 -25 -10 -5 -1 0 1 5 10 25 50 75 127
    
    ;; Extract the first lane as a signed int (should be -128)
    i8x16.extract_lane_s 0
  )

  (func (export "i8x16_extract_lane_s_vs_u") (result i32)
    ;; Create a v128 with a potentially sign-extended value (200 is stored as -56 in i8)
    v128.const i8x16 200 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    
    ;; Extract the first lane as signed int 
    ;; (should be -56 since 200 overflows i8 and becomes -56 when interpreted as signed)
    i8x16.extract_lane_s 0
  )
) ;; Generated by 🤖
