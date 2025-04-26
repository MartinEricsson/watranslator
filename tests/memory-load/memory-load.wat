(module
  ;; Define a memory section with 1 page (64KB)
  (memory 1)
  
  ;; Data section to initialize memory with specific bytes
  (data (i32.const 0)
    "\01\02\03\04\05\06\07\08\ff\fe"
  )
  
  ;; Test i32.load - Load a 32-bit value from memory
  (func $load_i32 (param $addr i32) (result i32)
    local.get $addr
    i32.load        ;; Load 4 bytes as i32
  )
  
  ;; Test i32.load8_s - Load a byte and sign-extend to i32
  (func $load_i32_8_s (param $addr i32) (result i32)
    local.get $addr
    i32.load8_s     ;; Load 1 byte and sign-extend
  )
  
  ;; Test i32.load8_u - Load a byte and zero-extend to i32
  (func $load_i32_8_u (param $addr i32) (result i32)
    local.get $addr
    i32.load8_u     ;; Load 1 byte and zero-extend
  )
  
  ;; Test i32.load16_s - Load 2 bytes and sign-extend to i32
  (func $load_i32_16_s (param $addr i32) (result i32)
    local.get $addr
    i32.load16_s    ;; Load 2 bytes and sign-extend
  )
  
  ;; Test i32.load16_u - Load 2 bytes and zero-extend to i32
  (func $load_i32_16_u (param $addr i32) (result i32)
    local.get $addr
    i32.load16_u    ;; Load 2 bytes and zero-extend
  )
  
  ;; Test memory load with offset
  (func $load_i32_offset (param $addr i32) (result i32)
    local.get $addr
    i32.load offset=4    ;; Load 4 bytes with offset=4
  )
  
  ;; Export all test functions
  (export "load_i32" (func $load_i32))
  (export "load_i32_8_s" (func $load_i32_8_s))
  (export "load_i32_8_u" (func $load_i32_8_u))
  (export "load_i32_16_s" (func $load_i32_16_s))
  (export "load_i32_16_u" (func $load_i32_16_u))
  (export "load_i32_offset" (func $load_i32_offset))
)