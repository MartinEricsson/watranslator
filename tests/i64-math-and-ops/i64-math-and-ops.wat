(module
    (memory 1)
    
    (func (export "i64_extend8_s") (param $a i64) (result i64)
        local.get $a
        i64.extend8_s
    )
    
    (func (export "i64_extend16_s") (param $a i64) (result i64)
        local.get $a
        i64.extend16_s
    )
    
    (func (export "i64_extend32_s") (param $a i64) (result i64)
        local.get $a
        i64.extend32_s
    )

    (func (export "i64_extend_i32_s") (param $a i32) (result i64)
        local.get $a
        i64.extend_i32_s
    )
    (func (export "i64_extend_i32_u") (param $a i32) (result i64)
        local.get $a
        i64.extend_i32_u
    )

    (func (export "i64_const") (result i64)
        i64.const 42
    )

    (func (export "i64_const_hex") (result i64)
        i64.const 0xFF
    )
    
    (func (export "i64_const_large") (result i64)
        i64.const 9223372036854775807
    )
    
    (func (export "i64_const_small") (result i64)
        i64.const -9223372036854775808
    )
    
    (func (export "i64_add") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.add
    )
    
    (func (export "i64_sub") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.sub
    )
    
    (func (export "i64_mul") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.mul
    )
    
    (func (export "i64_div_s") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.div_s
    )
    
    (func (export "i64_div_u") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.div_u
    )
    
    (func (export "i64_rem_s") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.rem_s
    )
    
    (func (export "i64_rem_u") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.rem_u
    )
    
    (func (export "i64_and") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.and
    )
    
    (func (export "i64_or") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.or
    )
    
    (func (export "i64_xor") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.xor
    )
    
    (func (export "i64_shl") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.shl
    )
    
    (func (export "i64_shr_s") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.shr_s
    )
    
    (func (export "i64_shr_u") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.shr_u
    )

    (func (export "i64_rotl") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.rotl
    )

    (func (export "i64_rotr") (param $a i64) (param $b i64) (result i64)
        local.get $a
        local.get $b
        i64.rotr
    )
    
    (func (export "i64_eqz") (param $a i64) (result i32)
        local.get $a
        i64.eqz
    )

    (func (export "i64_eq") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.eq
    )

    (func (export "i64_ne") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.ne
    )
    (func (export "i64_lt_s") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.lt_s
    )
    (func (export "i64_lt_u") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.lt_u
    )
    (func (export "i64_gt_s") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.gt_s
    )
    (func (export "i64_gt_u") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.gt_u
    )
    (func (export "i64_le_s") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.le_s
    )
    (func (export "i64_le_u") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.le_u
    )
    (func (export "i64_ge_s") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.ge_s
    )
    (func (export "i64_ge_u") (param $a i64) (param $b i64) (result i32)
        local.get $a
        local.get $b
        i64.ge_u
    )
    (func (export "i64_clz") (param $a i64) (result i64)
        local.get $a
        i64.clz
    )
    (func (export "i64_ctz") (param $a i64) (result i64)
        local.get $a
        i64.ctz
    )
    (func (export "i64_popcnt") (param $a i64) (result i64)
        local.get $a
        i64.popcnt
    )
    (func (export "i64_trunc_f32_s") (param $a f32) (result i64)
        local.get $a
        i64.trunc_f32_s
    )
    (func (export "i64_trunc_f32_u") (param $a f32) (result i64)
        local.get $a
        i64.trunc_f32_u
    )
    (func (export "i64_trunc_f64_s") (param $a f64) (result i64)
        local.get $a
        i64.trunc_f64_s
    )
    (func (export "i64_trunc_f64_u") (param $a f64) (result i64)
        local.get $a
        i64.trunc_f64_u
    )
    (func (export "i64_reinterpret_f64") (param $a f64) (result i64)
        local.get $a
        i64.reinterpret_f64
    )
    
)