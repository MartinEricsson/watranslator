(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    call $identity
    local.get $b
    i32.add)
    
  (func $multiply_and_add (param $x i32) (param $y i32) (param $z i32) (result i32)
    local.get $x
    local.get $y
    i32.mul
    local.get $z
    call $add)

  (func $identity (param $a i32) (result i32)
    local.get $a
    )
    
  (export "multiplyAndAdd" (func $multiply_and_add)))
  