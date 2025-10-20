class Game {
    constructor() {
        this.player = document.getElementById('player');
        this.gameContainer = document.getElementById('game-container');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.playerPos = { x: 300, y: 200 };
        this.stars = [];
        this.obstacles = [];
        this.keys = {};
        this.gameLoop = null;
        this.spawnInterval = null;
        
        this.init();
    }

    init() {
        // Set initial player position
        this.updatePlayerPosition();
        
        // Event listeners
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        // Start game loops
        this.gameLoop = setInterval(() => this.update(), 16);
        this.spawnInterval = setInterval(() => this.spawnObjects(), 2000);
        
        // Spawn initial objects
        this.spawnObjects();
    }

    update() {
        // Move player
        if (this.keys['ArrowLeft']) this.playerPos.x = Math.max(0, this.playerPos.x - 5);
        if (this.keys['ArrowRight']) this.playerPos.x = Math.min(570, this.playerPos.x + 5);
        if (this.keys['ArrowUp']) this.playerPos.y = Math.max(0, this.playerPos.y - 5);
        if (this.keys['ArrowDown']) this.playerPos.y = Math.min(370, this.playerPos.y + 5);
        
        this.updatePlayerPosition();
        this.checkCollisions();
        this.moveObjects();
    }

    updatePlayerPosition() {
        this.player.style.left = this.playerPos.x + 'px';
        this.player.style.top = this.playerPos.y + 'px';
    }

    spawnObjects() {
        // Spawn star
        if (Math.random() < 0.7) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 580 + 'px';
            star.style.top = '-20px';
            this.gameContainer.appendChild(star);
            this.stars.push(star);
        }

        // Spawn obstacle
        if (Math.random() < 0.5) {
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            obstacle.style.left = Math.random() * 560 + 'px';
            obstacle.style.top = '-40px';
            this.gameContainer.appendChild(obstacle);
            this.obstacles.push(obstacle);
        }
    }

    moveObjects() {
        // Move stars
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            const top = parseFloat(star.style.top) + 3;
            star.style.top = top + 'px';
            
            if (top > 400) {
                star.remove();
                this.stars.splice(i, 1);
            }
        }

        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            const top = parseFloat(obstacle.style.top) + 2;
            obstacle.style.top = top + 'px';
            
            if (top > 400) {
                obstacle.remove();
                this.obstacles.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        const playerRect = this.player.getBoundingClientRect();

        // Check star collisions
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const starRect = this.stars[i].getBoundingClientRect();
            if (this.isColliding(playerRect, starRect)) {
                this.stars[i].remove();
                this.stars.splice(i, 1);
                this.score += 10;
                this.scoreElement.textContent = `Score: ${this.score}`;
            }
        }

        // Check obstacle collisions
        for (const obstacle of this.obstacles) {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (this.isColliding(playerRect, obstacleRect)) {
                this.endGame();
                return;
            }
        }
    }

    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }

    endGame() {
        clearInterval(this.gameLoop);
        clearInterval(this.spawnInterval);
        alert(`Game Over! Final Score: ${this.score}`);
        location.reload();
    }
}

// Start the game when the page loads
window.onload = () => new Game();