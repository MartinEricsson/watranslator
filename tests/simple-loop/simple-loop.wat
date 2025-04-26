(module
  ;; Function that counts from 1 to n
  (func $countToN (param $n i32) (result i32)
    (local $i i32)
    (local $sum i32)
    
    ;; Initialize variables
    i32.const 1
    local.set $i      ;; i = 1
    
    i32.const 0
    local.set $sum    ;; sum = 0
    
    ;; Simple loop
    block $exit
      loop $continue
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
        
        ;; Compare i with n
        local.get $i
        local.get $n
        i32.le_s       ;; i <= n ?
        
        ;; If condition is true, continue loop
        br_if $continue
      end
    end
    
    ;; Return sum
    local.get $sum
  )
  
  ;; Export the function
  (export "countToN" (func $countToN))
)