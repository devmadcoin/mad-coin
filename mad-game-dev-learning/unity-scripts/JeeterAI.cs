using UnityEngine;
using UnityEngine.AI;

/* ═══════════════════════════════════════════════════════════
   $MAD JEETER ENEMY AI
   
   Attach to enemy GameObject.
   Requires: NavMeshAgent component
   
   States:
   - Idle: Patrol between waypoints
   - Chase: Follow player when in range
   - Attack: Deal damage when close
   - Die: Death animation + destroy
   ═══════════════════════════════════════════════════════════ */

public class JeeterAI : MonoBehaviour
{
    [Header("Detection")]
    [SerializeField] float detectionRange = 15f;
    [SerializeField] float attackRange = 2f;
    [SerializeField] float loseInterestRange = 25f;
    
    [Header("Movement")]
    [SerializeField] float patrolSpeed = 2f;
    [SerializeField] float chaseSpeed = 5f;
    [SerializeField] Transform[] patrolPoints;
    
    [Header("Combat")]
    [SerializeField] int attackDamage = 15;
    [SerializeField] float attackCooldown = 1.5f;
    
    [Header("Health")]
    [SerializeField] int maxHealth = 50;
    
    NavMeshAgent agent;
    Transform player;
    int currentPatrolIndex = 0;
    int currentHealth;
    float lastAttackTime;
    
    enum State { Idle, Chase, Attack, Die }
    State currentState = State.Idle;
    
    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        currentHealth = maxHealth;
        
        // Find player
        GameObject playerObj = GameObject.FindGameObjectWithTag("Player");
        if (playerObj != null) player = playerObj.transform;
        
        // Start patrolling
        if (patrolPoints.Length > 0)
        {
            agent.SetDestination(patrolPoints[0].position);
        }
    }
    
    void Update()
    {
        if (currentState == State.Die) return;
        
        float distanceToPlayer = player != null ? 
            Vector3.Distance(transform.position, player.position) : Mathf.Infinity;
        
        switch (currentState)
        {
            case State.Idle:
                Patrol();
                
                // Detect player
                if (distanceToPlayer <= detectionRange)
                {
                    currentState = State.Chase;
                    agent.speed = chaseSpeed;
                    Debug.Log("Jeeter spotted player! GET $MAD! 😡");
                }
                break;
                
            case State.Chase:
                ChasePlayer();
                
                if (distanceToPlayer <= attackRange)
                {
                    currentState = State.Attack;
                }
                else if (distanceToPlayer > loseInterestRange)
                {
                    currentState = State.Idle;
                    agent.speed = patrolSpeed;
                }
                break;
                
            case State.Attack:
                AttackPlayer();
                
                if (distanceToPlayer > attackRange)
                {
                    currentState = State.Chase;
                }
                break;
        }
        
        // Face movement direction
        if (agent.velocity.sqrMagnitude > 0.01f)
        {
            transform.rotation = Quaternion.LookRotation(agent.velocity.normalized);
        }
    }
    
    void Patrol()
    {
        if (patrolPoints.Length == 0) return;
        
        // Reached waypoint?
        if (agent.remainingDistance < 0.5f)
        {
            currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Length;
            agent.SetDestination(patrolPoints[currentPatrolIndex].position);
        }
    }
    
    void ChasePlayer()
    {
        if (player != null)
        {
            agent.SetDestination(player.position);
        }
    }
    
    void AttackPlayer()
    {
        // Stop moving
        agent.isStopped = true;
        
        // Face player
        if (player != null)
        {
            transform.LookAt(player.position);
        }
        
        // Attack on cooldown
        if (Time.time >= lastAttackTime + attackCooldown)
        {
            lastAttackTime = Time.time;
            
            // Deal damage to player
            if (player != null)
            {
                var playerHealth = player.GetComponent<PlayerHealth>();
                if (playerHealth != null)
                {
                    playerHealth.TakeDamage(attackDamage);
                    Debug.Log($"Jeeter attacked for {attackDamage} damage!");
                }
            }
            
            // Attack animation trigger
            // animator.SetTrigger("Attack");
        }
    }
    
    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        
        // Flash red or show hit effect
        // StartCoroutine(FlashRed());
        
        if (currentHealth <= 0)
        {
            Die();
        }
    }
    
    void Die()
    {
        currentState = State.Die;
        agent.isStopped = true;
        
        // Drop coins
        // CoinManager.Instance.SpawnCoinDrop(transform.position);
        
        // Death animation
        // animator.SetTrigger("Die");
        
        Debug.Log("Jeeter eliminated! 💎");
        
        Destroy(gameObject, 2f);
    }
    
    // Visualize ranges in editor
    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, detectionRange);
        
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, attackRange);
    }
}

/* ═══════════════════════════════════════════════════════════
   PLAYER HEALTH — Attach to Player GameObject
   ═══════════════════════════════════════════════════════════ */

public class PlayerHealth : MonoBehaviour
{
    [SerializeField] int maxHealth = 100;
    [SerializeField] float invincibilityDuration = 1f;
    
    int currentHealth;
    bool isInvincible;
    
    public int CurrentHealth => currentHealth;
    public bool IsAlive => currentHealth > 0;
    
    void Start()
    {
        currentHealth = maxHealth;
    }
    
    public void TakeDamage(int damage)
    {
        if (isInvincible || !IsAlive) return;
        
        currentHealth -= damage;
        Debug.Log($"Player took {damage} damage! HP: {currentHealth}/{maxHealth}");
        
        if (currentHealth <= 0)
        {
            Die();
        }
        else
        {
            StartCoroutine(InvincibilityFrames());
        }
    }
    
    public void Heal(int amount)
    {
        currentHealth = Mathf.Min(maxHealth, currentHealth + amount);
    }
    
    System.Collections.IEnumerator InvincibilityFrames()
    {
        isInvincible = true;
        yield return new WaitForSeconds(invincibilityDuration);
        isInvincible = false;
    }
    
    void Die()
    {
        Debug.Log("Player died! The $MAD spirit lives on...");
        
        // Respawn or game over
        GameManager.Instance?.RespawnPlayer(this);
    }
}
