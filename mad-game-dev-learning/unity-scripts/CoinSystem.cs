using UnityEngine;
using UnityEngine.UI;

/* ═══════════════════════════════════════════════════════════
   $MAD COIN COLLECTIBLE SYSTEM
   
   Attach Coin script to collectible objects.
   Attach CoinManager to a GameManager object.
   
   Features:
   - Rotating coins with bob animation
   - Collection detection
   - Score tracking with UI
   - Particle effect on collect
   ═══════════════════════════════════════════════════════════ */

public class Coin : MonoBehaviour
{
    [Header("Visual")]
    [SerializeField] float rotateSpeed = 100f;
    [SerializeField] float bobAmount = 0.5f;
    [SerializeField] float bobSpeed = 2f;
    
    [Header("Collection")]
    [SerializeField] int coinValue = 10;
    [SerializeField] ParticleSystem collectEffect;
    
    Vector3 startPosition;
    bool isCollected = false;
    
    void Start()
    {
        startPosition = transform.position;
    }
    
    void Update()
    {
        if (isCollected) return;
        
        // Rotate
        transform.Rotate(Vector3.up * rotateSpeed * Time.deltaTime);
        
        // Bob up and down
        float bob = Mathf.Sin(Time.time * bobSpeed) * bobAmount;
        transform.position = startPosition + Vector3.up * bob;
    }
    
    void OnTriggerEnter(Collider other)
    {
        if (isCollected) return;
        
        // Check if player touched us
        if (other.CompareTag("Player"))
        {
            Collect();
        }
    }
    
    void Collect()
    {
        isCollected = true;
        
        // Add to score
        CoinManager.Instance.AddCoins(coinValue);
        
        // Visual feedback
        if (collectEffect != null)
        {
            Instantiate(collectEffect, transform.position, Quaternion.identity);
        }
        
        // Sound (optional - add AudioSource)
        // AudioManager.Instance.Play("CoinCollect");
        
        // Destroy with small delay for effects to play
        GetComponent<Collider>().enabled = false;
        GetComponent<MeshRenderer>().enabled = false;
        
        Destroy(gameObject, 0.5f);
    }
}

/* ═══════════════════════════════════════════════════════════
   COIN MANAGER — Singleton for score tracking
   ═══════════════════════════════════════════════════════════ */

public class CoinManager : MonoBehaviour
{
    public static CoinManager Instance;
    
    [Header("UI")]
    [SerializeField] Text coinText;
    [SerializeField] Text scorePopupText;
    
    [Header("Madness Thresholds")]
    [SerializeField] int madRichThreshold = 1000;
    
    public int TotalCoins { get; private set; }
    public bool IsMadRich => TotalCoins >= madRichThreshold;
    
    void Awake()
    {
        // Singleton setup
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject); // Persist between scenes
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void AddCoins(int amount)
    {
        TotalCoins += amount;
        UpdateUI();
        
        // Check milestones
        if (TotalCoins >= madRichThreshold && TotalCoins - amount < madRichThreshold)
        {
            Debug.Log("🔥 YOU ARE MAD RICH! 🔥");
            // Trigger celebration
        }
    }
    
    public bool SpendCoins(int amount)
    {
        if (TotalCoins >= amount)
        {
            TotalCoins -= amount;
            UpdateUI();
            return true;
        }
        return false;
    }
    
    void UpdateUI()
    {
        if (coinText != null)
        {
            coinText.text = $"💰 {TotalCoins}";
        }
    }
    
    // Save/Load
    public void Save()
    {
        PlayerPrefs.SetInt("MAD_Coins", TotalCoins);
        PlayerPrefs.Save();
    }
    
    public void Load()
    {
        TotalCoins = PlayerPrefs.GetInt("MAD_Coins", 0);
        UpdateUI();
    }
}
