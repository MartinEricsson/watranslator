(module
    (func $encode_small (result i32)
        i32.const 10
    )

    (func $encode_big (result i32)
        i32.const 165000 
    )

    (func $encode_negative (result i32)
        i32.const -1000
    )

    (func $encode_hex (result i32)
        i32.const 0x0
    )

     (func $encode_hexier (result i32)
        i32.const 0xFF
    )

    (export "encode_small" (func $encode_small))
    (export "encode_big" (func $encode_big))
    (export "encode_negative" (func $encode_negative))
    (export "encode_hex" (func $encode_hex))
    (export "encode_hexier" (func $encode_hexier))
)