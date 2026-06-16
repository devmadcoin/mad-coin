using UnityEngine;
using UnityEngine.SceneManagement;

/* ═══════════════════════════════════════════════════════════
   $MAD GAME MANAGER — Singleton Pattern
   
   The central hub. Attach to a GameObject in your first scene.
   Persists across scene loads (DontDestroyOnLoad).
   
   Responsibilities:
   - Game state management (Menu, Playing, Paused, GameOver)
   - Player spawning / respawning
   - Scene loading
   - Score / high score tracking
   - Settings (audio, quality)
   ═══════════════════════════════════════════════════════════ */

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    [Header("Player")]
    [SerializeField] GameObject playerPrefab;
    [SerializeField] Transform[] spawnPoints;
    
    [Header("UI")]
    [SerializeField] GameObject pauseMenu;
    [SerializeField] GameObject gameOverScreen;
    [SerializeField] GameObject hud;
    
    [Header("Settings")]
    [SerializeField] bool startPaused = false;
    
    // State
    public enum GameState { Menu, Playing, Paused, GameOver }
    public GameState CurrentState { get; private set; }
    
    // Runtime data
    public int CurrentScore { get; private set; }
    public int HighScore { get; private set; }
    public float SessionTime { get; private set; }
    
    // Events (other scripts can subscribe)
    public System.Action OnGameStart;
    public System.Action OnGameOver;
    public System.Action<int> OnScoreChanged;
    
    void Awake()
    {
        // Singleton setup
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        
        Instance = this;
        DontDestroyOnLoad(gameObject);
        
        // Load saved data
        LoadData();
    }
    
    void Start()
    {
        if (!startPaused)
        {
            StartGame();
        }
    }
    
    void Update()
    {
        if (CurrentState == GameState.Playing)
        {
            SessionTime += Time.deltaTime;
        }
        
        // Pause toggle
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            TogglePause();
        }
    }
    
    // ═══════════════════════════════════════════════════
    // GAME FLOW
    // ═══════════════════════════════════════════════════
    
    public void StartGame()
    {
        CurrentState = GameState.Playing;
        CurrentScore = 0;
        SessionTime = 0;
        
        // Spawn player
        SpawnPlayer();
        
        // UI
        hud?.SetActive(true);
        pauseMenu?.SetActive(false);
        gameOverScreen?.SetActive(false);
        
        // Lock cursor
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
        
        OnGameStart?.Invoke();
        Debug.Log("🎮 GAME START — GET $MAD!");
    }
    
    public void GameOver()
    {
        CurrentState = GameState.GameOver;
        
        // Update high score
        if (CurrentScore > HighScore)
        {
            HighScore = CurrentScore;
            SaveData();
            Debug.Log($"🏆 NEW HIGH SCORE: {HighScore}!");
        }
        
        // UI
        hud?.SetActive(false);
        gameOverScreen?.SetActive(true);
        
        // Unlock cursor
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
        
        OnGameOver?.Invoke();
        Debug.Log("💀 GAME OVER — The $MAD spirit never dies.");
    }
    
    public void TogglePause()
    {
        if (CurrentState == GameState.Playing)
        {
            Pause();
        }
        else if (CurrentState == GameState.Paused)
        {
            Resume();
        }
    }
    
    void Pause()
    {
        CurrentState = GameState.Paused;
        Time.timeScale = 0f; // Freeze game
        
        pauseMenu?.SetActive(true);
        
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }
    
    void Resume()
    {
        CurrentState = GameState.Playing;
        Time.timeScale = 1f;
        
        pauseMenu?.SetActive(false);
        
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }
    
    // ═══════════════════════════════════════════════════
    // SCENE MANAGEMENT
    // ═══════════════════════════════════════════════════
    
    public void LoadScene(string sceneName)
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene(sceneName);
    }
    
    public void RestartGame()
    {
        LoadScene(SceneManager.GetActiveScene().name);
    }
    
    public void QuitGame()
    {
        SaveData();
        
        #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
        #else
            Application.Quit();
        #endif
    }
    
    // ═══════════════════════════════════════════════════
    // PLAYER MANAGEMENT
    // ═══════════════════════════════════════════════════
    
    void SpawnPlayer()
    {
        if (playerPrefab == null || spawnPoints.Length == 0) return;
        
        Transform spawn = spawnPoints[Random.Range(0, spawnPoints.Length)];
        Instantiate(playerPrefab, spawn.position, spawn.rotation);
    }
    
    public void RespawnPlayer(PlayerHealth player)
    {
        // Optional: deduct score, wait, respawn
        StartCoroutine(RespawnCoroutine(player));
    }
    
    System.Collections.IEnumerator RespawnCoroutine(PlayerHealth player)
    {
        yield return new WaitForSeconds(2f);
        
        // Find spawn point
        Transform spawn = spawnPoints[Random.Range(0, spawnPoints.Length)];
        
        // Move player
        player.transform.position = spawn.position;
        player.GetComponent<CharacterController>()?.Move(Vector3.zero);
        
        // Heal
        player.SendMessage("Heal", 100);
        
        Debug.Log("🔄 Player respawned!");
    }
    
    // ═══════════════════════════════════════════════════
    // SCORING
    // ═══════════════════════════════════════════════════
    
    public void AddScore(int points)
    {
        CurrentScore += points;
        OnScoreChanged?.Invoke(CurrentScore);
        
        Debug.Log($"Score: {CurrentScore}");
    }
    
    // ═══════════════════════════════════════════════════
    // SAVE / LOAD
    // ═══════════════════════════════════════════════════
    
    void SaveData()
    {
        PlayerPrefs.SetInt("MAD_HighScore", HighScore);
        PlayerPrefs.SetFloat("MAD_TotalPlayTime", 
            PlayerPrefs.GetFloat("MAD_TotalPlayTime", 0) + SessionTime);
        PlayerPrefs.Save();
    }
    
    void LoadData()
    {
        HighScore = PlayerPrefs.GetInt("MAD_HighScore", 0);
    }
}
