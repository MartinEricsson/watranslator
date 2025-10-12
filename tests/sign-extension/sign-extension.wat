(module
  (func (export "i32_extend8_s_positive") (result i32)
    i32.const 0x0000007F
    i32.extend8_s
  )
  
  (func (export "i32_extend8_s_negative") (result i32)
    i32.const 0x000000FF
    i32.extend8_s
  )
  
  (func (export "i32_extend8_s_zero") (result i32)
    i32.const 0x00000000
    i32.extend8_s
  )
  
  (func (export "i32_extend8_s_max_positive") (result i32)
    i32.const 0x0000007F
    i32.extend8_s
  )
  
  (func (export "i32_extend8_s_max_negative") (result i32)
    i32.const 0x00000080
    i32.extend8_s
  )
  
  (func (export "i32_extend16_s_positive") (result i32)
    i32.const 0x00007FFF
    i32.extend16_s
  )
  
  (func (export "i32_extend16_s_negative") (result i32)
    i32.const 0x0000FFFF
    i32.extend16_s
  )
  
  (func (export "i32_extend16_s_zero") (result i32)
    i32.const 0x00000000
    i32.extend16_s
  )
  
  (func (export "i32_extend16_s_max_positive") (result i32)
    i32.const 0x00007FFF
    i32.extend16_s
  )
  
  (func (export "i32_extend16_s_max_negative") (result i32)
    i32.const 0x00008000
    i32.extend16_s
  )
  
  (func (export "i64_extend8_s_positive") (result i64)
    i64.const 0x000000000000007F
    i64.extend8_s
  )
  
  (func (export "i64_extend8_s_negative") (result i64)
    i64.const 0x00000000000000FF
    i64.extend8_s
  )
  
  (func (export "i64_extend8_s_zero") (result i64)
    i64.const 0x0000000000000000
    i64.extend8_s
  )
  
  (func (export "i64_extend8_s_max_positive") (result i64)
    i64.const 0x000000000000007F
    i64.extend8_s
  )
  
  (func (export "i64_extend8_s_max_negative") (result i64)
    i64.const 0x0000000000000080
    i64.extend8_s
  )
  
  (func (export "i64_extend16_s_positive") (result i64)
    i64.const 0x0000000000007FFF
    i64.extend16_s
  )
  
  (func (export "i64_extend16_s_negative") (result i64)
    i64.const 0x000000000000FFFF
    i64.extend16_s
  )
  
  (func (export "i64_extend16_s_zero") (result i64)
    i64.const 0x0000000000000000
    i64.extend16_s
  )
  
  (func (export "i64_extend16_s_max_positive") (result i64)
    i64.const 0x0000000000007FFF
    i64.extend16_s
  )
  
  (func (export "i64_extend16_s_max_negative") (result i64)
    i64.const 0x0000000000008000
    i64.extend16_s
  )
  
  (func (export "i64_extend32_s_positive") (result i64)
    i64.const 0x000000007FFFFFFF
    i64.extend32_s
  )
  
  (func (export "i64_extend32_s_negative") (result i64)
    i64.const 0x00000000FFFFFFFF
    i64.extend32_s
  )
  
  (func (export "i64_extend32_s_zero") (result i64)
    i64.const 0x0000000000000000
    i64.extend32_s
  )
  
  (func (export "i64_extend32_s_max_positive") (result i64)
    i64.const 0x000000007FFFFFFF
    i64.extend32_s
  )
  
  (func (export "i64_extend32_s_max_negative") (result i64)
    i64.const 0x0000000080000000
    i64.extend32_s
  )
)
