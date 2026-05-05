(module
    (func (export "neg_one_hex") (result i64)
        i64.const -0x1
    )
    (func (export "neg_large_hex") (result i64)
        i64.const -0xDEADBEEF
    )
)
