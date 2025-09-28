// Main application logic
class ArithimanciaApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Check if we're on the main page
        if (document.querySelector('.main-content')) {
            this.initializeMainMenu();
        }
    }

    initializeMainMenu() {
        const menuButtons = document.querySelectorAll('.menu-btn');

        menuButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.handleMenuClick(index);
            });
        });

        // Add hover effects
        this.addMenuEffects();
    }

    handleMenuClick(buttonIndex) {
        const actions = [
            () => this.startNewGame(),      // Nova aventura
            () => this.loadGame(),          // Carregar jogo
            () => this.showHowToPlay()      // Como jogar
        ];

        if (actions[buttonIndex]) {
            actions[buttonIndex]();
        }
    }

    startNewGame() {
        // Add transition effect
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.7';

        setTimeout(() => {
            window.location.href = 'character-selection.html';
        }, 300);
    }

    loadGame() {
        // Check if there's a saved game
        const savedGame = localStorage.getItem('arithimanciaGameData');

        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            alert(`Carregando jogo de ${gameData.playerName} como ${gameData.character}`);
            // Redirect to game with saved data
            window.location.href = 'game.html';
        } else {
            alert('Nenhum jogo salvo encontrado! Inicie uma nova aventura.');
        }
    }

    showHowToPlay() {
        // Create modal or redirect to instructions
        this.showInstructionsModal();
    }

    showInstructionsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Como Jogar</h2>
                <div class="instructions">
                    <h3>🎯 Objetivo</h3>
                    <p>Explore o mundo matemático, resolva problemas e evolua seu personagem.</p>

                    <h3>🎮 Controles</h3>
                    <p>Use os botões na tela para navegar e tomar decisões.</p>

                    <h3>🧮 Sistema de Combate</h3>
                    <p>Resolva equações e problemas matemáticos para vencer batalhas.</p>

                    <h3>📈 Progressão</h3>
                    <p>Ganhe experiência resolvendo problemas mais complexos.</p>
                </div>
                <button class="close-modal">Fechar</button>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #a855f7;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    addMenuEffects() {
        const menuButtons = document.querySelectorAll('.menu-btn');

        menuButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
}

// Global utility functions
class GameUtils {
    static saveGameData(data) {
        localStorage.setItem('arithimanciaGameData', JSON.stringify(data));
    }

    static loadGameData() {
        const data = localStorage.getItem('arithimanciaGameData');
        return data ? JSON.parse(data) : null;
    }

    static clearGameData() {
        localStorage.removeItem('arithimanciaGameData');
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArithimanciaApp();
});

// Add CSS for modal animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .modal-content h2 {
        color: #a855f7;
        margin-bottom: 20px;
        text-align: center;
    }

    .modal-content h3 {
        color: #a855f7;
        margin: 15px 0 8px 0;
        font-size: 16px;
    }

    .modal-content p {
        margin-bottom: 10px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.8);
    }

    .close-modal {
        background: linear-gradient(135deg, #a855f7, #8b5cf6);
        border: none;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        margin-top: 20px;
        width: 100%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(168, 85, 247, 0.3);
    }
`;
document.head.appendChild(style);