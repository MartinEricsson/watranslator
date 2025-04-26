(module
 (global $y (import "env" "y") i32)
 (global $x i32 (i32.const 42))

 (func (export "getY") (result i32)
   global.get $y
 )

 (func (export "getX") (result i32)
   global.get $x
 )
)
