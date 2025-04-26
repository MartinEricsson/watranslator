(module
    (func $cnt (param $a i32) (result i32)
        local.get $a
        i32.popcnt
    )

    (func $clz (param $a i32) (result i32)
        local.get $a
        i32.clz
    )

    (func $ctz (param $a i32) (result i32)
        local.get $a
        i32.ctz
    )

    (export "cnt" (func $cnt))
    (export "clz" (func $clz))
    (export "ctz" (func $ctz))
)