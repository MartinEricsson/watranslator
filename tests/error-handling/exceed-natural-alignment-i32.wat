(module
  (memory 1)
  (func $main (export "main") (result i32)
    i32.const 0
    i32.load align=3   ;; Natural alignment for i32.load is 2, so 3 exceeds it
  )
)