(module
    (import "system" "logfv" (func $_logfv (param f32) (param f32) (param f32) (param f32)))
    
    (func $param_128
        v128.const f32x4 1.0 2.0 3.0 4.0
        call $_param_128
    )

    (func $_param_128 (param $v v128)
        local.get $v
        f32x4.extract_lane 0
        local.get $v
        f32x4.extract_lane 1
        local.get $v
        f32x4.extract_lane 2
        local.get $v
        f32x4.extract_lane 3
        call $_logfv
    )

    (export "param_128" (func $param_128))
)