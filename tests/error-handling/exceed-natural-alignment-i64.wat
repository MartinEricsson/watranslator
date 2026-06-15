(module
  (memory 1)
  (func $main (export "main") (result i64)
    i32.const 0
    i64.load align=16   ;; Natural alignment for i64.load is 8 bytes (log2=3), so 16 exceeds it
  )
)