(module
    ;; Define a mutable global to store the result of the start function
    (global $initialized (mut i32) (i32.const 0))
    
    ;; Our initialization function that will be run automatically
    (func $init
        ;; Set the global variable to indicate initialization has happened
        i32.const 42
        global.set $initialized
    )
    
    ;; Function to get the initialization status
    (func $getInitStatus (result i32)
        global.get $initialized
    )
    
    ;; Mark the init function as the module's start function
    (start $init)
    
    ;; Export the getInitStatus function to test that initialization happened
    (export "getInitStatus" (func $getInitStatus))
)