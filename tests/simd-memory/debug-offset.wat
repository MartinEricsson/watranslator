(module
  ;; Define a memory section with 1 page (64KB)
  (memory 1)

  ;; Export the memory
  (export "memory" (memory 0))

  ;; Initialize memory with test data
  (data (i32.const 0)
    ;; 16 bytes of sequential data for testing v128 operations
    "\00\01\02\03\04\05\06\07\08\09\0A\0B\0C\0D\0E\0F"
    ;; Additional 16 bytes with alternating values
    "\AA\BB\CC\DD\EE\FF\AA\BB\CC\DD\EE\FF\AA\BB\CC\DD"
  )

  ;; Debug function to read bytes at different offsets
  (func (export "read_byte_at_offset") (param $offset i32) (result i32)
    local.get $offset
    i32.load8_u
  )

  ;; Test v128.load with offset
  (func (export "test_v128_load_offset") (result i32)
    ;; Load v128 from effective address 16 (base + offset)
    i32.const 0
    v128.load offset=16
    
    ;; Extract first lane to verify (should be 0xAA)
    i8x16.extract_lane_u 0
  )
)
;; Generated by 🤖
