(module
  ;; Function that subtracts two i32 numbers
  (func $subtract (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub
  )
  
  ;; Export the function
  (export "subtract" (func $subtract))
)