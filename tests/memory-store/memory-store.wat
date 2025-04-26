(module
  ;; Define a memory section with 1 page (64KB)
  (memory 1)
  (export "memory" (memory 0))
  
  ;; Test i32.store - Store a 32-bit value to memory
  (func $store (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store        ;; Store 4 bytes from i32
  )
  
  ;; Test i32.store with custom alignment and offset
  (func $store_with_align_offset (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store offset=8 align=2  ;; Store with offset=8, align=4 bytes
  )
  
  ;; Test i32.store8 - Store the low 8 bits
  (func $store8 (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store8       ;; Store 1 byte from i32
  )
  
  ;; Test i32.store16 - Store the low 16 bits
  (func $store16 (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store16      ;; Store 2 bytes from i32
  )
  
  ;; Load function to verify stores worked correctly
  (func $load (param $addr i32) (result i32)
    local.get $addr
    i32.load          ;; Load 4 bytes as i32
  )
  
  ;; Export all test functions
  (export "store" (func $store))
  (export "store_with_align_offset" (func $store_with_align_offset))
  (export "store8" (func $store8))
  (export "store16" (func $store16))
  (export "load" (func $load))
)