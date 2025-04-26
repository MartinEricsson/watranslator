(module
  ;; Immutable global with i32 constant initialization
  (global $answer i32 (i32.const 42))
  
  ;; Mutable global with initialization
  (global $counter (mut i32) (i32.const 0))
  
  ;; Float global
  (global $pi f32 (f32.const 3.14159))
  
  ;; Mutable float global
  (global $temperature (mut f32) (f32.const 22.5))
  
  ;; Get immutable global
  (func $getAnswer (result i32)
    global.get $answer)
  
  ;; Get and set mutable global
  (func $incrementCounter (result i32)
    ;; Get current value
    global.get $counter
    
    ;; Load 1
    i32.const 1
    
    ;; Add 1 to counter
    i32.add
    
    ;; Store back to counter and leave value on stack for return
    ;; In WebAssembly, we need to use local.tee or get it again
    global.set $counter
    global.get $counter)
  
  ;; Convert between float and int globals
  (func $celsiusToFahrenheit (result f32)
    ;; F = C * 9/5 + 32
    global.get $temperature  ;; Get celsius
    f32.const 9
    f32.mul
    f32.const 5
    f32.div
    f32.const 32
    f32.add)
  
  ;; Update mutable float global
  (func $setTemperature (param $new_temp f32)
    local.get $new_temp
    global.set $temperature)
  
  ;; Export the functions
  (export "getAnswer" (func $getAnswer))
  (export "incrementCounter" (func $incrementCounter))
  (export "celsiusToFahrenheit" (func $celsiusToFahrenheit))
  (export "setTemperature" (func $setTemperature))
  
  ;; Export some globals
  (export "answer" (global $answer))
  (export "temperature" (global $temperature))
)