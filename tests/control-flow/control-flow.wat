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

  ;; Regression: nested loops expressed in folded S-expression form
  (func (export "foldedLoops") (result i32)
    (local $row i32)
    (local $col i32)
    (local $sum i32)

    ;; Initialise counters
    i32.const 0
    local.set $row
    i32.const 0
    local.set $sum

    (block $outer_exit
      (loop $outer
        ;; Stop outer loop when row >= 3
        local.get $row
        i32.const 3
        i32.ge_s
        br_if $outer_exit

        ;; Reset column counter
        i32.const 0
        local.set $col

        (block $inner_exit
          (loop $inner
            ;; Stop inner loop when col >= 2
            local.get $col
            i32.const 2
            i32.ge_s
            br_if $inner_exit

            ;; Accumulate row + col into sum
            local.get $sum
            local.get $row
            local.get $col
            i32.add
            i32.add
            local.set $sum

            ;; Advance column
            local.get $col
            i32.const 1
            i32.add
            local.set $col

            ;; Continue inner loop
            br $inner
          )
        )

        ;; Advance row and continue outer loop
        local.get $row
        i32.const 1
        i32.add
        local.set $row
        br $outer
      )
    )

    local.get $sum
  )

  (func (export "tee") (param $a i32) (result i32)
    local.get $a
    local.tee $a
  )
)