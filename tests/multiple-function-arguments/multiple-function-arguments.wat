(module
    (func (export "add_labels") (param $a i32) (param $b i32) (param $c i32) (result i32)
        local.get $c
        local.get $b
        local.get $a
        i32.add
      	i32.add
    )

    (func (export "add") (param i32 i32 i32) (result i32)
        local.get 0
        local.get 1
        local.get 2
        i32.add
        i32.add
    )
)