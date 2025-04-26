(module
  (func $main (export "main") (result i32)
    i32.const 1
    call $nonexistent_function
    i32.const 42
  )
)