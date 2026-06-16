using UnityEngine;

/* ═══════════════════════════════════════════════════════════
   $MAD 3D CHARACTER CONTROLLER
   
   Attach this to your Player GameObject.
   Requires: CharacterController component
   
   Features:
   - WASD / Arrow key movement
   - Space to jump
   - Mouse look (first-person style)
   - Ground check
   - Smooth movement with acceleration
   ═══════════════════════════════════════════════════════════ */

[RequireComponent(typeof(CharacterController))]
public class MadCharacterController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] float moveSpeed = 5f;
    [SerializeField] float sprintSpeed = 10f;
    [SerializeField] float acceleration = 10f;
    
    [Header("Jumping")]
    [SerializeField] float jumpForce = 8f;
    [SerializeField] float gravity = -20f;
    
    [Header("Mouse Look")]
    [SerializeField] float mouseSensitivity = 2f;
    [SerializeField] float maxLookAngle = 80f;
    
    [Header("Ground Check")]
    [SerializeField] Transform groundCheck;
    [SerializeField] float groundDistance = 0.4f;
    [SerializeField] LayerMask groundMask;
    
    // Private state
    CharacterController controller;
    Camera playerCamera;
    Vector3 velocity;
    Vector3 currentMove;
    float xRotation = 0f;
    bool isGrounded;
    
    void Awake()
    {
        controller = GetComponent<CharacterController>();
        playerCamera = Camera.main;
        
        // Lock cursor for first-person feel
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }
    
    void Update()
    {
        HandleMouseLook();
        HandleMovement();
        HandleJumping();
        ApplyGravity();
        
        // Unlock cursor with Escape
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
        
        // Lock cursor with click
        if (Input.GetMouseButtonDown(0) && Cursor.visible)
        {
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
    }
    
    void HandleMouseLook()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;
        
        // Look up/down (clamp so you don't flip)
        xRotation -= mouseY;
        xRotation = Mathf.Clamp(xRotation, -maxLookAngle, maxLookAngle);
        
        playerCamera.transform.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
        
        // Look left/right (rotate entire body)
        transform.Rotate(Vector3.up * mouseX);
    }
    
    void HandleMovement()
    {
        // Get input
        float horizontal = Input.GetAxisRaw("Horizontal");
        float vertical = Input.GetAxisRaw("Vertical");
        
        // Sprint check
        float speed = Input.GetKey(KeyCode.LeftShift) ? sprintSpeed : moveSpeed;
        
        // Calculate move direction relative to where player is facing
        Vector3 moveDirection = transform.right * horizontal + transform.forward * vertical;
        
        // Normalize so diagonal isn't faster
        if (moveDirection.magnitude > 1f)
            moveDirection.Normalize();
        
        // Smooth acceleration (lerp current to target)
        Vector3 targetMove = moveDirection * speed;
        currentMove = Vector3.Lerp(currentMove, targetMove, acceleration * Time.deltaTime);
        
        // Apply movement (only X and Z, Y is handled by gravity/jump)
        controller.Move(currentMove * Time.deltaTime);
    }
    
    void HandleJumping()
    {
        // Ground check using Physics.OverlapSphere
        isGrounded = Physics.CheckSphere(groundCheck.position, groundDistance, groundMask);
        
        // Reset vertical velocity when grounded
        if (isGrounded && velocity.y < 0)
        {
            velocity.y = -2f; // small downward force to stay grounded
        }
        
        // Jump
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            velocity.y = Mathf.Sqrt(jumpForce * -2f * gravity);
            
            // Optional: jump effect
            Debug.Log("$MAD JUMP! 🔥");
        }
    }
    
    void ApplyGravity()
    {
        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
    
    // Visualize ground check in editor
    void OnDrawGizmosSelected()
    {
        if (groundCheck != null)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(groundCheck.position, groundDistance);
        }
    }
}
