(module
  ;; Import memory
  (memory (export "memory") 1)

  ;; Initialize memory with test data
  (data (i32.const 0) "\00\01\02\03\04\05\06\07\08\09\0A\0B\0C\0D\0E\0F")
  (data (i32.const 16) "\10\11\12\13\14\15\16\17\18\19\1A\1B\1C\1D\1E\1F")
  (data (i32.const 32) "\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF\FF")

  ;; Test i16x8.eq (equality)
  (func (export "i16x8_eq_test") (result i32)
    i32.const 0
    v128.load
    i32.const 0
    v128.load
    i16x8.eq     ;; compare identical vectors, all lanes should be -1 (true)
    i16x8.extract_lane_s 0)  ;; Extract the first lane, should be -1 (all bits set)

  ;; Test i16x8.ne (not equal)
  (func (export "i16x8_ne_test") (result i32)
    i32.const 0
    v128.load
    i32.const 16
    v128.load
    i16x8.ne    ;; compare different vectors, all lanes should be -1 (true)
    i16x8.extract_lane_s 0)  ;; Extract the first lane, should be -1 (all bits set)

  ;; Test i16x8.lt_s (less than, signed)
  (func (export "i16x8_lt_s_test") (result i32)
    i32.const 0  ;; Vector with smaller values
    v128.load
    i32.const 16 ;; Vector with larger values
    v128.load
    i16x8.lt_s     ;; first < second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.lt_u (less than, unsigned)
  (func (export "i16x8_lt_u_test") (result i32)
    i32.const 0  ;; Vector with smaller values
    v128.load
    i32.const 16 ;; Vector with larger values
    v128.load
    i16x8.lt_u     ;; first < second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.gt_s (greater than, signed)
  (func (export "i16x8_gt_s_test") (result i32)
    i32.const 16 ;; Vector with larger values
    v128.load
    i32.const 0  ;; Vector with smaller values
    v128.load
    i16x8.gt_s     ;; first > second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.gt_u (greater than, unsigned)
  (func (export "i16x8_gt_u_test") (result i32)
    i32.const 16 ;; Vector with larger values
    v128.load
    i32.const 0  ;; Vector with smaller values
    v128.load
    i16x8.gt_u     ;; first > second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.le_s (less than or equal, signed)
  (func (export "i16x8_le_s_test") (result i32)
    i32.const 0  ;; Vector with smaller values
    v128.load
    i32.const 0  ;; Same vector
    v128.load
    i16x8.le_s     ;; first <= second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.le_u (less than or equal, unsigned)
  (func (export "i16x8_le_u_test") (result i32)
    i32.const 0  ;; Vector with smaller values
    v128.load
    i32.const 0  ;; Same vector
    v128.load
    i16x8.le_u     ;; first <= second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.ge_s (greater than or equal, signed)
  (func (export "i16x8_ge_s_test") (result i32)
    i32.const 16 ;; Vector with larger values
    v128.load
    i32.const 16 ;; Same vector
    v128.load
    i16x8.ge_s     ;; first >= second, should be true (-1)
    i16x8.extract_lane_s 0)

  ;; Test i16x8.ge_u (greater than or equal, unsigned)
  (func (export "i16x8_ge_u_test") (result i32)
    i32.const 16 ;; Vector with larger values
    v128.load
    i32.const 16 ;; Same vector
    v128.load
    i16x8.ge_u     ;; first >= second, should be true (-1)
    i16x8.extract_lane_s 0)
)
