;; Generated by 🤖
(module
  (table 1 funcref)
  
  (func $simple (type $later_type)
    i32.const 42)
    
  (func (export "run") (result i32)
    i32.const 0
    call_indirect (type $later_type))
    
  (elem (i32.const 0) $simple)
  
  (type $later_type (func (result i32)))
)
