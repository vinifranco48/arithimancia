// Character Selection Logic
class CharacterSelection {
    constructor() {
        this.selectedCharacter = 'geometras'; // Pre-selected
        this.playerName = '';
        this.initializeElements();
        this.bindEvents();
        this.updateStartButton();
    }

    initializeElements() {
        this.characterCards = document.querySelectorAll('.character-card');
        this.startBtn = document.querySelector('.start-btn');
        this.nameInput = document.querySelector('.name-input');
        this.backBtn = document.querySelector('.back-btn');
    }

    bindEvents() {
        // Character card selection
        this.characterCards.forEach(card => {
            card.addEventListener('click', () => this.selectCharacter(card));
        });

        // Name input monitoring
        this.nameInput.addEventListener('input', () => this.handleNameInput());

        // Button events
        this.startBtn.addEventListener('click', () => this.startGame());
        this.backBtn.addEventListener('click', () => this.goBack());

        // Enter key to start game
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.canStartGame()) {
                this.startGame();
            }
        });
    }

    selectCharacter(selectedCard) {
        // Remove previous selection
        this.characterCards.forEach(card => card.classList.remove('selected'));

        // Add current selection
        selectedCard.classList.add('selected');
        this.selectedCharacter = selectedCard.dataset.character;

        // Update start button state
        this.updateStartButton();

        // Visual feedback
        this.animateSelection(selectedCard);
    }

    handleNameInput() {
        this.playerName = this.nameInput.value.trim();
        this.updateStartButton();
    }

    updateStartButton() {
        if (this.canStartGame()) {
            this.startBtn.classList.add('active');
        } else {
            this.startBtn.classList.remove('active');
        }
    }

    canStartGame() {
        return this.playerName && this.selectedCharacter;
    }

    animateSelection(card) {
        // Add a subtle pulse animation
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    startGame() {
        if (!this.canStartGame()) return;

        const gameData = {
            playerName: this.playerName,
            character: this.selectedCharacter,
            timestamp: new Date().toISOString(),
            gameState: {
                pp: 100,
                axiomas: 0,
                teoremas: 0,
                inventory: [],
                location: 'inicio',
                completedMissions: []
            }
        };

        // Save to localStorage
        localStorage.setItem('arithimanciaGameData', JSON.stringify(gameData));

        // Show loading state
        this.showLoadingState();

        // Simulate loading and redirect to game
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1000);
    }

    showLoadingState() {
        this.startBtn.textContent = 'Iniciando...';
        this.startBtn.style.pointerEvents = 'none';

        // Disable all interactions
        this.characterCards.forEach(card => {
            card.style.pointerEvents = 'none';
        });
        this.nameInput.disabled = true;
    }

    goBack() {
        // Add transition effect
        document.body.style.opacity = '0.5';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }

    // Character descriptions for tooltip or detailed view
    getCharacterInfo(character) {
        const characters = {
            algebristas: {
                name: "Os Algebristas",
                subtitle: "Reino Construído da Disciplina",
                description: "Mestres das equações e sistemas lineares. Acreditam que a ordem surge da resolução metódica.",
                powers: ["Manipulação de Variáveis", "Sistema Linear", "Equações"],
                icon: "📐"
            },
            geometras: {
                name: "Os Geômetras",
                subtitle: "Reino Harmonioso das Formas",
                description: "Especialistas em espaço e estruturas. Reconhecem a realidade formal por forma.",
                powers: ["Controlo de Espaço", "Portal", "Construção", "Desconstrução"],
                icon: "📏"
            },
            trigonometras: {
                name: "Os Trigonômetras",
                subtitle: "Reino Cíclico Eterno",
                description: "Guardiões dos padrões cíclicos. Conhecem ondas e frequências cósmicas.",
                powers: ["Controlo de Ondas", "Sincronização", "Previsão Cíclica"],
                icon: "📊"
            },
            numerologos: {
                name: "Os Numerólogos",
                subtitle: "Reino Sagrados dos Números Puros",
                description: "Místicos dos números. Cada número possui essência e poder único.",
                powers: ["Invocação Numérica", "Decifrção de Padrões", "Estimação"],
                icon: "🔢"
            }
        };
        return characters[character];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CharacterSelection();
});

// Global functions for HTML onclick events (backwards compatibility)
function goBack() {
    const characterSelection = new CharacterSelection();
    characterSelection.goBack();
}

function startGame() {
    const characterSelection = new CharacterSelection();
    characterSelection.startGame();
}