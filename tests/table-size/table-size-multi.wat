(module
  (table $t0 3 funcref)
  (table $t1 7 funcref)
  (table $t2 11 funcref)
  
  (func (export "sizes") (result i32 i32 i32)
    table.size 0
    table.size 1
    table.size 2))
