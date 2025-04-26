(module
  ;; Function with an if/else block
  (func (export "max") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.gt_s                ;; Check if $a > $b
    if (result i32)         ;; If $a > $b
      local.get $a          ;; Return $a
    else
      local.get $b          ;; Return $b
    end
  )

  ;; Function with a simple loop that counts to n
  (func (export "countToN") (param $n i32) (result i32)
    (local $i i32)
    (local $sum i32)
    
    ;; Initialize $i to 0
    i32.const 0
    local.set $i
    
    ;; Initialize $sum to 0
    i32.const 0
    local.set $sum
    
    ;; Start a loop
    block $exit
      loop $continue
        ;; Add $i to $sum
        local.get $sum
        local.get $i
        i32.add
        local.set $sum
        
        ;; Increment $i
        local.get $i
        i32.const 1
        i32.add
        local.set $i
        
        ;; Check if $i <= $n
        local.get $i
        local.get $n
        i32.le_s
        
        ;; If $i <= $n, continue the loop
        br_if $continue
        
        ;; Otherwise, exit the loop
      end
    end
    
    ;; Return the sum
    local.get $sum
  )

  (func (export "tee") (param $a i32) (result i32)
    local.get $a
    local.tee $a
  )
)