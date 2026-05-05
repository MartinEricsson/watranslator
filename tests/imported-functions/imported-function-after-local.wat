(module
  (func $local (export "run") (param $value i32) (result i32)
    local.get $value
    call $imported
    i32.const 10
    i32.add
  )

  (import "env" "imported" (func $imported (param i32) (result i32)))
)
