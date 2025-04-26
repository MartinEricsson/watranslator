(module
  (memory 1)
  (func $main (export "main") (result i32)
    i32.const 0
    i32.load offset=xyz
  )
)