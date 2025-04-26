(module
  (memory 1)
  (func $main (export "main") (result i64)
    i32.const 0
    i64.load align=4   ;; Natural alignment for i64.load is 3, so 4 exceeds it
  )
)