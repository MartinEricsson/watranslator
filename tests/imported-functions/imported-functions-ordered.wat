(module
  (import "edg" "clear" (func $edg_clear (param i32) (result i32)))
  
  ;; Additional function to clear a value using the imported clear function
  (func $clearValue (export "clearValue") (param $value i32) (result i32)
    local.get $value
    call $edg_clear
  )
)
