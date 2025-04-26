(module
  (func $addAndDouble (param $a i32) (param $b i32) (result i32)
    (local $sum i32)
    
    ;; Calculate sum
    local.get $a
    local.get $b
    i32.add
    local.set $sum
    
    ;; Double the sum
    local.get $sum
    i32.const 2
    i32.mul
    
    ;; Result is on top of stack
  )
  (export "addAndDouble" (func $addAndDouble))
)