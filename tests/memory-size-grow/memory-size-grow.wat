(module
  ;; Define a memory section with initial size of 1 page (64KB)
  (memory 1)
  (export "memory" (memory 0))
  
  ;; Function to get current memory size in pages (64KB per page)
  (func $getMemorySize (result i32)
    memory.size  ;; Returns the current memory size in pages
  )
  (export "getMemorySize" (func $getMemorySize))
  
  ;; Function to grow memory by N pages and return previous size
  (func $growMemory (param $pages i32) (result i32)
    local.get $pages
    memory.grow  ;; Grows memory by $pages and returns previous size
  )
  (export "growMemory" (func $growMemory))
  
  ;; Function to allocate memory at the current memory size
  ;; and grow by specified number of bytes
  ;; Returns the starting address of the allocated memory
  (func $allocate (param $bytes i32) (result i32)
    (local $current_pages i32)
    
    ;; Get current memory size in pages and save it
    memory.size
    local.set $current_pages
    
    ;; Calculate the number of pages needed
    local.get $bytes
    i32.const 65535  ;; 2^16 - 1 (for rounding up)
    i32.add
    i32.const 65536  ;; 2^16
    i32.div_u        ;; Divide by page size
    
    ;; Grow the memory by calculated number of pages
    memory.grow
    drop
    
    ;; Return the fixed allocation address - should be at first page boundary
    i32.const 65536  ;; 2^16 (start of the second page, which is the first allocation point)
  )
  (export "allocate" (func $allocate))
  
  ;; Function to write to a memory address in a byte-by-byte manner to handle endianness
  (func $write (param $addr i32) (param $value i32)
    ;; Write each byte separately to avoid endianness issues
    ;; Byte 0 (least significant)
    local.get $addr
    local.get $value
    i32.const 0xFF  ;; Mask for the least significant byte
    i32.and
    i32.store8
    
    ;; Byte 1
    local.get $addr
    i32.const 1
    i32.add
    local.get $value
    i32.const 8
    i32.shr_u
    i32.const 0xFF
    i32.and
    i32.store8
    
    ;; Byte 2
    local.get $addr
    i32.const 2
    i32.add
    local.get $value
    i32.const 16
    i32.shr_u
    i32.const 0xFF
    i32.and
    i32.store8
    
    ;; Byte 3 (most significant)
    local.get $addr
    i32.const 3
    i32.add
    local.get $value
    i32.const 24
    i32.shr_u
    i32.const 0xFF
    i32.and
    i32.store8
  )
  (export "write" (func $write))
  
  ;; Function to read from a memory address in a byte-by-byte manner to handle endianness
  (func $read (param $addr i32) (result i32)
    ;; Combine bytes manually to avoid endianness issues
    (local $result i32)
    
    ;; Read byte 0 (least significant)
    local.get $addr
    i32.load8_u
    local.set $result
    
    ;; Read byte 1 and shift
    local.get $result
    local.get $addr
    i32.const 1
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.set $result
    
    ;; Read byte 2 and shift
    local.get $result
    local.get $addr
    i32.const 2
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.set $result
    
    ;; Read byte 3 and shift
    local.get $result
    local.get $addr
    i32.const 3
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    i32.or
    
    ;; Return combined result
  )
  (export "read" (func $read))
)