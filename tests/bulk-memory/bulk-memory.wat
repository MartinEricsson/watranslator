(module
  ;; Declare a memory with initial size of 1 page (64KB)
  (memory $mem 1)

  ;; Export the memory so we can inspect it from our test
  (export "memory" (memory $mem))

  ;; Data section 1: Initialize bytes 0-9
  (data (i32.const 0) "\00\01\02\03\04\05\06\07\08\09")

  ;; Data section 2: Initialize text
  (data (i32.const 100) "Bulk Memory Test")

  ;; Data section 3: Test data
  (data (i32.const 200) "\ff\fe\aa\bb")

  ;; Function to read a byte from memory
  (func $readByte (param $addr i32) (result i32)
    local.get $addr
    i32.load8_u
  )

  ;; Function to read an int from memory - using i32.load to read a full 32-bit integer
  (func $readInt (param $addr i32) (result i32)
    local.get $addr
    i32.load  ;; Using i32.load to read a full 32-bit integer
  )

  ;; Function to read a 64-bit integer from memory
  (func $readI64 (param $addr i32) (result i64)
    local.get $addr
    i64.load
  )

  ;; Export the functions
  (export "readByte" (func $readByte))
  (export "readInt" (func $readInt))
  (export "readI64" (func $readI64))
)