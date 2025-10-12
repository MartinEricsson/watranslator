(module
  (memory $mem0 (export "mem0") 1)
  (memory $mem1 (export "mem1") 1)
  (memory $mem2 (export "mem2") 1)
  
  (func (export "store_mem0") (param i32 i32)
    local.get 0
    local.get 1
    i32.store $mem0)
  
  (func (export "store_mem1") (param i32 i32)
    local.get 0
    local.get 1
    i32.store $mem1)
  
  (func (export "store_mem2") (param i32 i32)
    local.get 0
    local.get 1
    i32.store $mem2)
  
  (func (export "load_mem0") (param i32) (result i32)
    local.get 0
    i32.load $mem0)
  
  (func (export "load_mem1") (param i32) (result i32)
    local.get 0
    i32.load $mem1)
  
  (func (export "load_mem2") (param i32) (result i32)
    local.get 0
    i32.load $mem2)
  
  (func (export "size_mem0") (result i32)
    memory.size $mem0)
  
  (func (export "size_mem1") (result i32)
    memory.size $mem1)
  
  (func (export "size_mem2") (result i32)
    memory.size $mem2)
  
  (func (export "grow_mem1") (param i32) (result i32)
    local.get 0
    memory.grow $mem1)
  
  (func (export "fill_mem2") (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    memory.fill $mem2)
  
  (func (export "copy_mem0_to_mem1") (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    memory.copy $mem1 $mem0)
  
  (func (export "store_i64_mem1") (param i32 i64)
    local.get 0
    local.get 1
    i64.store $mem1)
  
  (func (export "load_i64_mem1") (param i32) (result i64)
    local.get 0
    i64.load $mem1)
  
  (func (export "store_f32_mem2") (param i32 f32)
    local.get 0
    local.get 1
    f32.store $mem2)
  
  (func (export "load_f32_mem2") (param i32) (result f32)
    local.get 0
    f32.load $mem2)
  
  (func (export "store_f64_mem0") (param i32 f64)
    local.get 0
    local.get 1
    f64.store $mem0)
  
  (func (export "load_f64_mem0") (param i32) (result f64)
    local.get 0
    f64.load $mem0))
