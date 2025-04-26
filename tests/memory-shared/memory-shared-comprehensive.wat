(module
  ;; Shared memory with minimum and maximum values
  (memory 2 8 shared)
  (export "memory" (memory 0))
  
  ;; Test with atomic operations
  (;func $atomicAdd (param $addr i32) (param $value i32) (result i32)
    local.get $addr
    local.get $value
    i32.atomic.rmw.add
  ;)
  
  ;; Test with regular memory operations
  (func $regularStore (param $addr i32) (param $value i32)
    local.get $addr
    local.get $value
    i32.store
  )
  
  ;; Test with regular load
  (func $regularLoad (param $addr i32) (result i32)
    local.get $addr
    i32.load
  )
  
  (;export "atomicAdd" (func $atomicAdd);)
  (export "regularStore" (func $regularStore))
  (export "regularLoad" (func $regularLoad))
)
