(module
    (func $add (param $lhs i32) (param $rhs i32) (result i32) ;; this a comment
        local.get $lhs ;; this also a comment
        local.get $rhs (; this is a comment ;)
        (;
            multiline comment
            with some code
            in the middle
            (local.get $lhs)
            (local.get $rhs)
        ;)
        (; comment before code;) i32.add
        ;; a line comment
        nop
    )
    (export "add" (func $add))
)
