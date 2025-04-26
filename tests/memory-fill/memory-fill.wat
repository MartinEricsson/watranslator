(module
  ;; Declare a memory with initial size of 1 page (64KB)
  (memory $mem 1)

  ;; Export the memory so we can inspect it from our test
  (export "memory" (memory $mem))

  ;; Function to fill a memory region with a specific byte value
  ;; Parameters:
  ;;   $dest - Destination address where to start filling
  ;;   $val  - Byte value to fill with (only low 8 bits used)
  ;;   $size - Number of bytes to fill
  (func $fill (param $dest i32) (param $val i32) (param $size i32)
    local.get $dest  ;; Destination address
    local.get $val   ;; Value to fill with (byte value)
    local.get $size  ;; Size (number of bytes to fill)
    memory.fill      ;; Fill memory
  )

  ;; Function to read a byte from memory
  (func $readByte (param $addr i32) (result i32)
    local.get $addr
    i32.load8_u
  )
  
  ;; Function to copy a memory region
  (func $copy (param $dest i32) (param $src i32) (param $size i32)
    local.get $dest
    local.get $src
    local.get $size
    memory.copy
  )

  ;; Function to initialize memory from a data segment
  ;; Parameters:
  ;;   $dest - Destination address where to start copying data
  ;;   $offset - Offset in the data segment
  ;;   $size - Number of bytes to copy
  (func $init (param $dest i32) (param $offset i32) (param $size i32)
    local.get $dest   ;; Destination address
    local.get $offset ;; Offset within the data segment
    local.get $size   ;; Size (number of bytes to copy)
    i32.const 1       ;; Data segment index (1 = the passive data segment)
    memory.init       ;; Initialize memory from data segment
  )

  ;; Initialize memory with a pattern we can check later
  (data (i32.const 0) "\01\02\03\04\05\06\07\08\09\0A")
  
  ;; Passive data segment (used with memory.init)
  (data $special_data "\AA\BB\CC\DD\EE\FF\11\22\33\44")

  ;; Export the functions
  (export "fill" (func $fill))
  (export "readByte" (func $readByte))
  (export "copy" (func $copy))
  (export "init" (func $init))
)