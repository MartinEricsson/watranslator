(module
  (global $g i32 (i32.const 42))
  (func $main (export "main") (result i32)
    i32.const 100
    global.set $g
    global.get $g
  )
)