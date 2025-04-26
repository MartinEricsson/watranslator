(module
  (func $main (export "main") (result i32)
    i32.const 1
    br $nonexistent_label
    i32.const 42
  )
)