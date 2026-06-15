(module
  (memory 1)
  (func $main (export "main") (result i32)
    i32.const 0
    i32.load align=8   ;; Natural alignment for i32.load is 4 bytes (log2=2), so 8 exceeds it
  )
)