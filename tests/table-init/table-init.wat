;; Generated by 🤖
(module
  ;; Type for functions that return i32
  (type $fn_i32 (func (result i32)))
  
  ;; Define table with min size 4
  (table $tbl 4 4 funcref)
  
  ;; Define functions that will be referenced
  (func $f1 (type $fn_i32)
    i32.const 42)
    
  (func $f2 (type $fn_i32)
    i32.const 43)
    
  (func $f3 (type $fn_i32)
    i32.const 44)
    
  ;; Define a passive element segment with function references
  (elem $elem0 func $f1 $f2 $f3)
  
  ;; Function to initialize table entries from element segment
  (func $init_table (param $dst i32) (param $src i32) (param $len i32)
    local.get $dst  ;; Destination index in table
    local.get $src  ;; Source index in element segment
    local.get $len  ;; Number of elements to copy
    table.init 0 0) ;; Initialize from element segment 0 to table 0
  
  ;; Function to get element from table
  (func $get_func (param i32) (result i32)
    local.get 0
    call_indirect (type $fn_i32))
  
  ;; Exports for testing
  (export "init_table" (func $init_table))
  (export "get_func" (func $get_func))
  (export "f1" (func $f1))
  (export "f2" (func $f2))
  (export "f3" (func $f3))
  (export "tbl" (table $tbl)))