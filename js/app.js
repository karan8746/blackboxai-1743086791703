// Core Game State
const gameState = {
    level: 1,
    xp: 0,
    get xpToNextLevel() {
        return this.calculateXPForLevel(this.level);
    },
    stats: {
        strength: 0,
        stamina: 0,
        consistency: 0
    },
    dailyTasks: [
        { id: 1, name: "30 pushups", completed: false },
        { id: 2, name: "5 pullups", completed: false },
        { id: 3, name: "50 squats", completed: false },
        { id: 4, name: "Drink 2L water", completed: false }
    ],
    completedTasks: 0,

    // XP calculation for levels 1-100
    calculateXPForLevel(level) {
        if (level < 10) return 1000 * level;
        if (level < 20) return 10000 + 2000 * (level - 10);
        if (level < 50) return 30000 + 5000 * (level - 20);
        if (level < 80) return 180000 + 10000 * (level - 50);
        return 480000 + 20000 * (level - 80);
    }
};


// DOM Elements
const elements = {
    levelDisplay: document.querySelector('.level-badge'),
    xpBar: document.querySelector('.bg-gradient-to-r'),
    statsDisplays: {
        strength: document.querySelector('.grid.grid-cols-2').children[0].querySelector('.text-lg'),
        stamina: document.querySelector('.grid.grid-cols-2').children[1].querySelector('.text-lg')
    },
    taskProgress: document.querySelector('.bg-gradient-to-r.from-blue-500'),
    taskCount: document.querySelector('.text-sm.text-right')
};

// Initialize the game
function init() {
    // Check authentication
    const authData = JSON.parse(localStorage.getItem('fCruiserAuth'));
    if (!authData?.loggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info in header
    const header = document.querySelector('header');
    if (authData.email) {
        const userBadge = document.createElement('div');
        userBadge.className = 'flex items-center mr-4';
        userBadge.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <i class="fas fa-user text-white"></i>
            </div>
            <span class="text-blue-400">${authData.email}</span>
        `;
        header.insertBefore(userBadge, header.firstChild);
    }

    updateUI();
    setupEventListeners();
}

// Update all UI elements
function updateUI() {
    // Update level and XP
    elements.levelDisplay.textContent = gameState.level;
    elements.xpBar.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;
    
    // Update stats
    elements.statsDisplays.strength.textContent = `+${gameState.stats.strength}%`;
    elements.statsDisplays.stamina.textContent = `+${gameState.stats.stamina}%`;
    
    // Update tasks
    const completedCount = gameState.dailyTasks.filter(t => t.completed).length;
    elements.taskProgress.style.width = `${(completedCount / gameState.dailyTasks.length) * 100}%`;
    elements.taskCount.textContent = `${completedCount}/${gameState.dailyTasks.length} tasks completed`;
}

// Setup event listeners
function setupEventListeners() {
    // Complete workout button
    document.querySelector('.bg-blue-600').addEventListener('click', () => {
        completeWorkout('Push-ups');
    });
}

// Complete a workout
function completeWorkout(exercise) {
    // Add XP
    gameState.xp += 250;
    gameState.completedTasks++;
    
    // Update stats
    gameState.stats.strength += 5;
    gameState.stats.stamina += 3;
    
    // Check for level up
    if (gameState.xp >= gameState.xpToNextLevel) {
        levelUp();
    }
    
    updateUI();
}

// Level up the player
function levelUp() {
    gameState.level++;
    gameState.xp = 0;
    
    // Show level up animation
    showLevelUpAnimation();
    
    // Special rewards every 10 levels
    if (gameState.level % 10 === 0) {
        showSpecialReward(gameState.level);
    }
}

// Show level up effects
function showLevelUpAnimation() {
    // Show modal
    const modal = document.getElementById('levelUpModal');
    document.getElementById('newLevelDisplay').textContent = gameState.level;
    modal.classList.remove('hidden');

    // Create energy effect container
    const energyContainer = document.createElement('div');
    energyContainer.className = 'level-up-container';
    
    // Add pulsing energy orb
    const orb = document.createElement('div');
    orb.className = 'energy-orb';
    orb.style.top = '50%';
    orb.style.left = '50%';
    orb.style.transform = 'translate(-50%, -50%)';
    energyContainer.appendChild(orb);

    // Add floating particles
    const particleCount = 50 + (gameState.level * 2);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animation = `
            particle-float ${2 + Math.random() * 3}s ease-in-out infinite,
            particle-pulse ${1 + Math.random() * 2}s ease-in-out infinite
        `;
        particle.style.setProperty('--delay', `${Math.random() * 2}s`);
        energyContainer.appendChild(particle);
    }

    document.body.appendChild(energyContainer);
    
    // Remove after animation
    setTimeout(() => {
        energyContainer.remove();
    }, 5000);

    // Add screen flash effect
    document.body.style.transition = 'background-color 0.3s';
    document.body.style.backgroundColor = 'rgba(0, 168, 255, 0.2)';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 300);
}

function showSpecialReward(level) {
    const rewards = {
        10: "New Workout Program Unlocked!",
        20: "Advanced Training Mode!",
        30: "Elite Status Achieved!",
        40: "Master Trainer Badge!",
        50: "Legendary Status Unlocked!",
        75: "Ultimate Fitness Master!",
        100: "MAX LEVEL CHAMPION!"
    };
    
    if (rewards[level]) {
        const rewardModal = document.createElement('div');
        rewardModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80';
        rewardModal.innerHTML = `
            <div class="bg-gray-900 p-8 rounded-xl border-2 border-yellow-500 max-w-md w-full text-center">
                <div class="text-6xl mb-4">🏆</div>
                <h2 class="text-3xl font-bold mb-2 text-yellow-400">LEVEL ${level} REWARD!</h2>
                <p class="text-xl mb-6">${rewards[level]}</p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition">
                    Claim Reward
                </button>
            </div>
        `;
        document.body.appendChild(rewardModal);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);