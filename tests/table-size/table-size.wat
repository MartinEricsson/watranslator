(module
  (table $t1 5 funcref)
  (table $t2 10 20 funcref)
  
  (func (export "get_size_t1") (result i32)
    table.size 0)
  
  (func (export "get_size_t2") (result i32)
    table.size 1)
  
  (func (export "grow_and_check") (result i32 i32)
    table.size 1
    ref.null func
    i32.const 5
    table.grow 1
    drop
    table.size 1)
  
  (func (export "size_after_fill") (result i32)
    i32.const 0
    ref.null func
    i32.const 3
    table.fill 0
    table.size 0)
  
  (export "t1" (table 0))
  (export "t2" (table 1)))
