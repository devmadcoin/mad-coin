using System;
using System.Collections.Generic;

namespace MadCoinCollector
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== $MAD COIN COLLECTOR ===");
            Console.WriteLine("GET MAD. STAY MAD.\n");
            
            Player player = new Player("$MAD Dev");
            Game game = new Game(player);
            game.Run();
        }
    }
    
    class Player
    {
        public string Name { get; private set; }
        public int Health { get; private set; }
        public int Coins { get; private set; }
        public int Rebirths { get; private set; }
        public bool IsAlive => Health > 0;
        public bool IsMadRich => Coins >= 1000;
        
        public Player(string name)
        {
            Name = name;
            Health = 100;
            Coins = 0;
            Rebirths = 0;
        }
        
        public void CollectCoin()
        {
            int amount = 10 * (1 + Rebirths);
            Coins += amount;
            Console.WriteLine($"💰 $MAD coin collected! (+{amount})");
            
            if (IsMadRich)
            {
                Console.WriteLine("🔥 YOU ARE MAD RICH! 🔥");
            }
        }
        
        public void FightJeeter()
        {
            Random rand = new Random();
            int damage = rand.Next(15, 35);
            int reward = rand.Next(40, 80) * (1 + Rebirths);
            
            Health -= damage;
            Coins += reward;
            
            Console.WriteLine($"⚔️  Jeeter defeated! (-{damage} HP, +{reward} coins)");
            
            if (!IsAlive)
            {
                Console.WriteLine("💀 The jeeters got you...");
            }
        }
        
        public void HODL()
        {
            int heal = 15;
            Health = Math.Min(100, Health + heal);
            Console.WriteLine($"💎 HODLing... +{heal} HP. Conviction restores.");
        }
        
        public void Rebirth()
        {
            if (Coins >= 100)
            {
                Coins = 0;
                Health = 100;
                Rebirths++;
                Console.WriteLine($"🔄 REBIRTH #{Rebirths}! Multiplier increased!");
            }
            else
            {
                Console.WriteLine("❌ Need 100 coins to rebirth. Keep grinding!");
            }
        }
        
        public void ShowStats()
        {
            Console.WriteLine($"\n📊 {Name}'s Stats:");
            Console.WriteLine($"   Health: {Health}/100 {(Health < 30 ? "⚠️ LOW!" : "")}");
            Console.WriteLine($"   Coins: {Coins} {(IsMadRich ? "💎 MAD RICH" : "")}");
            Console.WriteLine($"   Rebirths: {Rebirths} (x{1 + Rebirths} multiplier)");
        }
    }
    
    class Game
    {
        private Player player;
        private Random rand;
        private List<string> madQuotes;
        
        public Game(Player player)
        {
            this.player = player;
            this.rand = new Random();
            this.madQuotes = new List<string>
            {
                "GET $MAD 😡",
                "STAY MAD 💎",
                "MAD RICH 🔥",
                "I AM $MADly Focused",
                "THE TRENCHES WILL REMEMBER",
                "Comfy hold. Conviction cold."
            };
        }
        
        public void Run()
        {
            while (player.IsAlive)
            {
                ShowMenu();
                string choice = Console.ReadLine();
                ProcessChoice(choice);
                
                // Random MAD wisdom
                if (rand.Next(100) < 15)  // 15% chance
                {
                    Console.WriteLine($"\n💭 {madQuotes[rand.Next(madQuotes.Count)]}");
                }
            }
            
            GameOver();
        }
        
        void ShowMenu()
        {
            player.ShowStats();
            Console.WriteLine("\nWhat do you do?");
            Console.WriteLine("1. 💰 Collect Coin");
            Console.WriteLine("2. ⚔️  Fight Jeeter");
            Console.WriteLine("3. 💎 HODL (heal)");
            Console.WriteLine("4. 🔄 Rebirth (100 coins)");
            Console.WriteLine("5. 🚪 Exit");
            Console.Write("> ");
        }
        
        void ProcessChoice(string choice)
        {
            Console.WriteLine();
            
            switch (choice)
            {
                case "1":
                    player.CollectCoin();
                    break;
                case "2":
                    player.FightJeeter();
                    break;
                case "3":
                    player.HODL();
                    break;
                case "4":
                    player.Rebirth();
                    break;
                case "5":
                    Console.WriteLine("Stay MAD. See you in the trenches.");
                    Environment.Exit(0);
                    break;
                default:
                    Console.WriteLine("Invalid choice. Focus!");
                    break;
            }
        }
        
        void GameOver()
        {
            Console.WriteLine("\n=== GAME OVER ===");
            Console.WriteLine($"Final Score: {player.Coins} coins");
            Console.WriteLine($"Rebirths: {player.Rebirths}");
            Console.WriteLine("\nThe $MAD spirit never dies.");
            Console.WriteLine("Run again. GET $MAD.\n");
        }
    }
}
