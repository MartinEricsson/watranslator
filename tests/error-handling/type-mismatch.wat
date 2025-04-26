(module
  (func $add (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
  (func $main (export "main") (result i32)
    i32.const 1
    i32.const 2
    i32.const 3
    call $add
    i32.const 42
  )
)