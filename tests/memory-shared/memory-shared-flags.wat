(module
  ;; Shared memory with explicit min and max
  (memory 1 4 shared)
  (export "memory" (memory 0))
  
  ;; Simple function with no atomic operations
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )

  (export "add" (func $add))
)
