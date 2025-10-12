(module
  (func (export "single_nop") (result i32)
    nop
    i32.const 42
  )
  
  (func (export "multiple_nops") (result i32)
    nop
    nop
    nop
    i32.const 123
    nop
    nop
  )
  
  (func (export "nop_in_block") (result i32)
    block (result i32)
      nop
      i32.const 99
      nop
    end
  )
  
  (func (export "nop_in_if") (param i32) (result i32)
    local.get 0
    if (result i32)
      nop
      i32.const 1
      nop
    else
      nop
      i32.const 0
      nop
    end
  )
  
  (func (export "nop_in_loop") (result i32)
    (local $i i32)
    i32.const 0
    local.set $i
    
    loop
      nop
      local.get $i
      i32.const 1
      i32.add
      local.tee $i
      i32.const 3
      i32.lt_s
      br_if 0
      nop
    end
    
    local.get $i
  )
  
  (func (export "nop_stack_neutral") (result i32)
    i32.const 10
    nop
    i32.const 20
    nop
    i32.add
  )
)
