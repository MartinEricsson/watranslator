(module
  ;; Declare a memory with initial size of 1 page (64KB)
  (memory $mem 1)

  ;; Export the memory so we can inspect it from our test
  (export "memory" (memory $mem))

  ;; Data section with simple bytes (0 to 9)
  (data (i32.const 0) "\00\01\02\03\04\05\06\07\08\09")

  ;; Data section with ASCII text
  (data (i32.const 16) "Hello, WebAssembly!")

  ;; Data section with special characters/escape sequences
  (data (i32.const 64) "\09\0a\0d\22\27\5c")
  
  ;; Data section with hex values including FF and FE
  (data (i32.const 128) "\ff\fe\aa\bb\cc\dd\ee")
  
  ;; Data section with mixed content
  (data (i32.const 256) "Mix: \01\02\03 ABC \ff\fe!")

  ;; Export functions to access memory data
  (func $readByte (param $addr i32) (result i32)
    local.get $addr
    i32.load8_u
  )

  (func $readInt (param $addr i32) (result i32)
    local.get $addr
    i32.load
  )

  (export "readByte" (func $readByte))
  (export "readInt" (func $readInt))
)