(module
    (func $sum (param $n i32) (result i32)
        (local $i i32)
        (local $sum i32)
        ;; Initialize sum and i to 0
        i32.const 0
        local.set $sum
        i32.const 1  ;; Start from 1 instead of 0
        local.set $i
        block $break
            loop $top
                ;; Check if i <= n (not i < n)
                local.get $i
                local.get $n
                i32.gt_s     ;; i > n
                br_if $break  ;; break if i > n
                
                ;; Add i to sum
                local.get $sum
                local.get $i
                i32.add
                local.set $sum
                
                ;; Increment i
                local.get $i
                i32.const 1
                i32.add
                local.set $i
                
                br $top
            end
        end
        local.get $sum
    )
    (export "sum" (func $sum))
)