(module
  (memory 1 1 shared)
  (func $use_fence (export "use_fence") (result i32)
    ;; Perform some operations on shared memory
    i32.const 0
    i32.const 42
    i32.atomic.store
    
    ;; Insert a memory barrier
    atomic.fence
    
    ;; Continue with other operations
    i32.const 0
    i32.atomic.load)
)
