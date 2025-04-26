(module
  (func $early_return (param $x i32) (result i32)
    ;; Early return if x is less than 5
    local.get $x
    i32.const 5
    i32.lt_s
    if
      i32.const 0
      return  ;; Early return with value 0
    end
    
    ;; Otherwise calculate and return x * 2
    local.get $x
    i32.const 2
    i32.mul
  )
  (export "early_return" (func $early_return))
)
