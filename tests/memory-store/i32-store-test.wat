(module
  (memory 1)
  (export "memory" (memory 0))
  
  (func $store (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store
  )
  (export "store" (func $store))
  
  (func $load (param $addr i32) (result i32)
    local.get $addr
    i32.load
  )
  (export "load" (func $load))
)