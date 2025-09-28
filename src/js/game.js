// Game Logic and State Management
class ArithimanciaGame {
    constructor() {
        this.gameData = null;
        this.currentScenario = 'intro';
        this.gameState = {
            pp: 100,
            axiomas: 0,
            teoremas: 0,
            inventory: [],
            location: 'inicio',
            completedMissions: []
        };

        this.characterClasses = {
            algebristas: {
                name: "Os Algebristas",
                icon: "📐",
                powers: ["Manipulação de Variáveis", "Sistema Linear", "Equações"],
                description: "Física Axiomas da Ordem"
            },
            geometras: {
                name: "Os Geômetras",
                icon: "📏",
                powers: ["Controlo de Espaço", "Portal", "Construção", "Desconstrução"],
                description: "Reino Harmonioso das Formas"
            },
            trigonometras: {
                name: "Os Trigonômetras",
                icon: "📊",
                powers: ["Controlo de Ondas", "Sincronização", "Previsão Cíclica"],
                description: "Reino Cíclico Eterno"
            },
            numerologos: {
                name: "Os Numerólogos",
                icon: "🔢",
                powers: ["Invocação Numérica", "Decifrção de Padrões", "Estimação"],
                description: "Reino Sagrados dos Números Puros"
            }
        };

        this.scenarios = {
            intro: {
                title: "O Início da Jornada",
                story: `Você é um jovem {characterClass}, seguidor da filosofia <span class="highlight">"{characterDescription}"</span>.
                <br><br>
                O mundo de Arithimancia está em caos desde que o <span class="highlight">Paradoxo Zero</span> fragmentou a Grande Rede Matemática. Equações se tornaram instáveis, números perderam seu significado, e criaturas matemáticas corrompidas vagam pela terra.
                <br><br>
                Como membro dos {characterClass}, você domina <span class="highlight">{characterPowers}</span>. Seu arsenal matemático inclui axiomas puros carregados com energia matemática.`,
                question: "Onde você gostaria de começar sua jornada?",
                choices: [
                    {
                        id: 'biblioteca',
                        icon: '📚',
                        title: 'Visitar a Biblioteca de Alexandria Numérica',
                        description: 'Buscar conhecimentos antigos sobre a Grande Rede e seus fundamentos matemáticos.',
                        action: () => this.goToScenario('biblioteca')
                    },
                    {
                        id: 'deserto',
                        icon: '🏜️',
                        title: 'Explorar o Deserto das Funções Perdidas',
                        description: 'Investigar as ruínas matemáticas em busca de fragmentos da ordem perdida.',
                        action: () => this.goToScenario('deserto')
                    },
                    {
                        id: 'cidade',
                        icon: '🏛️',
                        title: 'Ir à Cidade dos Cálculos Perfeitos',
                        description: 'Reunir-se com outros matemáticos e formar uma aliança estratégica.',
                        action: () => this.goToScenario('cidade')
                    },
                    {
                        id: 'inventario',
                        icon: '🎒',
                        title: 'Verificar Inventário',
                        description: 'Examinar seus recursos, axiomas e ferramentas matemáticas disponíveis.',
                        action: () => this.showInventory()
                    }
                ]
            },
            biblioteca: {
                title: "Biblioteca de Alexandria Numérica",
                story: `Você caminha pelas majestosas portas da <span class="highlight">Biblioteca de Alexandria Numérica</span>.
                <br><br>
                As estantes se estendem infinitamente para cima, cada livro pulsando com <span class="highlight">energia matemática</span>. Equações flutuam no ar como partículas de poeira dourada.
                <br><br>
                No centro da biblioteca, você encontra a <span class="highlight">Bibliotecária Primordial</span>, uma entidade antiga feita de números puros.`,
                question: "O que você deseja fazer na biblioteca?",
                choices: [
                    {
                        id: 'pesquisar',
                        icon: '🔍',
                        title: 'Pesquisar sobre o Paradoxo Zero',
                        description: 'Investigar as origens da catástrofe matemática.',
                        action: () => this.startResearch()
                    },
                    {
                        id: 'falar',
                        icon: '💬',
                        title: 'Conversar com a Bibliotecária',
                        description: 'Buscar orientação da entidade antiga.',
                        action: () => this.talkToLibrarian()
                    },
                    {
                        id: 'explorar',
                        icon: '🗂️',
                        title: 'Explorar as Seções Especiais',
                        description: 'Procurar conhecimentos raros e poderosos.',
                        action: () => this.exploreLibrary()
                    },
                    {
                        id: 'voltar',
                        icon: '↩️',
                        title: 'Voltar ao ponto inicial',
                        description: 'Retornar ao início da jornada.',
                        action: () => this.goToScenario('intro')
                    }
                ]
            }
        };

        this.initialize();
    }

    initialize() {
        this.loadGameData();
        this.setupEventListeners();
        this.updateUI();
        this.loadScenario(this.currentScenario);
    }

    loadGameData() {
        const savedData = GameUtils.loadGameData();
        if (savedData) {
            this.gameData = savedData;
            this.gameState = { ...this.gameState, ...savedData.gameState };
            document.getElementById('welcome-title').textContent = `Bem-vindo de volta, ${savedData.playerName}!`;
        } else {
            // Redirect to character selection if no data
            setTimeout(() => {
                window.location.href = 'character-selection.html';
            }, 2000);
            return;
        }
    }

    setupEventListeners() {
        // Auto-save periodically
        setInterval(() => {
            this.saveGameState();
        }, 30000); // Save every 30 seconds
    }

    updateUI() {
        if (!this.gameData) return;

        const characterClass = this.characterClasses[this.gameData.character];

        // Update character info
        document.getElementById('character-icon').textContent = characterClass.icon;
        document.getElementById('character-name').textContent = this.gameData.playerName;
        document.getElementById('character-class').textContent = characterClass.name;

        // Update stats
        document.getElementById('pp-value').textContent = this.gameState.pp;
        document.getElementById('axiomas-value').textContent = this.gameState.axiomas;
        document.getElementById('teoremas-value').textContent = this.gameState.teoremas;
    }

    loadScenario(scenarioId) {
        const scenario = this.scenarios[scenarioId];
        if (!scenario) return;

        this.currentScenario = scenarioId;

        // Update story text
        const storyElement = document.getElementById('story-text');
        const characterClass = this.characterClasses[this.gameData.character];

        let storyText = scenario.story
            .replace('{characterClass}', characterClass.name)
            .replace('{characterDescription}', characterClass.description)
            .replace('{characterPowers}', characterClass.powers.join(', '));

        storyElement.innerHTML = storyText;

        // Update question
        document.getElementById('question-text').textContent = scenario.question;

        // Update choices
        this.renderChoices(scenario.choices);
    }

    renderChoices(choices) {
        const choicesGrid = document.getElementById('choices-grid');
        choicesGrid.innerHTML = '';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.style.animationDelay = `${(index + 1) * 0.1}s`;

            button.innerHTML = `
                <span class="choice-icon">${choice.icon}</span>
                <div class="choice-title">${choice.title}</div>
                <div class="choice-description">${choice.description}</div>
            `;

            button.addEventListener('click', () => {
                this.makeChoice(choice);
            });

            choicesGrid.appendChild(button);
        });
    }

    makeChoice(choice) {
        // Add visual feedback
        event.target.style.transform = 'scale(0.98)';
        setTimeout(() => {
            event.target.style.transform = '';
        }, 150);

        // Execute choice action
        if (choice.action) {
            choice.action();
        }

        // Save state
        this.saveGameState();
    }

    goToScenario(scenarioId) {
        this.gameState.location = scenarioId;
        this.loadScenario(scenarioId);
    }

    startResearch() {
        this.gameState.axiomas += 1;
        this.updateUI();

        alert('Você descobriu informações valiosas sobre o Paradoxo Zero! (+1 Axioma)');
        // Could transition to a research mini-game here
    }

    talkToLibrarian() {
        alert('A Bibliotecária sussurra segredos antigos em sua mente...');
        // Could show a dialogue system here
    }

    exploreLibrary() {
        const discoveries = [
            'Você encontrou um tomo sobre Geometria Sagrada!',
            'Um pergaminho de Álgebra Celestial foi descoberto!',
            'Você achou notas sobre Trigonometria Temporal!'
        ];

        const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
        alert(discovery);
    }

    saveGameState() {
        if (this.gameData) {
            this.gameData.gameState = this.gameState;
            this.gameData.lastPlayed = new Date().toISOString();
            GameUtils.saveGameData(this.gameData);
        }
    }

    // Control functions
    showInventory() {
        const inventoryModal = this.createModal('Inventário', `
            <div class="inventory-grid">
                <div class="inventory-section">
                    <h3>Axiomas: ${this.gameState.axiomas}</h3>
                    <p>Verdades fundamentais que você coletou</p>
                </div>
                <div class="inventory-section">
                    <h3>Teoremas: ${this.gameState.teoremas}</h3>
                    <p>Conhecimentos avançados provados</p>
                </div>
                <div class="inventory-section">
                    <h3>PP (Pontos de Poder): ${this.gameState.pp}</h3>
                    <p>Sua energia matemática atual</p>
                </div>
            </div>
        `);
    }

    showMap() {
        const mapModal = this.createModal('Mapa de Arithimancia', `
            <div class="map-content">
                <h3>Localização Atual: ${this.gameState.location}</h3>
                <div class="map-locations">
                    <div class="location-item">📚 Biblioteca de Alexandria Numérica</div>
                    <div class="location-item">🏜️ Deserto das Funções Perdidas</div>
                    <div class="location-item">🏛️ Cidade dos Cálculos Perfeitos</div>
                    <div class="location-item">🌟 Templo dos Números Primos</div>
                </div>
            </div>
        `);
    }

    saveGame() {
        this.saveGameState();

        const saveModal = this.createModal('Jogo Salvo', `
            <div class="save-content">
                <p>✅ Progresso salvo com sucesso!</p>
                <p><strong>Jogador:</strong> ${this.gameData.playerName}</p>
                <p><strong>Classe:</strong> ${this.characterClasses[this.gameData.character].name}</p>
                <p><strong>Localização:</strong> ${this.gameState.location}</p>
            </div>
        `);
    }

    goToMenu() {
        if (confirm('Deseja voltar ao menu principal? (O progresso será salvo automaticamente)')) {
            this.saveGameState();
            window.location.href = 'index.html';
        }
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                <div class="modal-body">${content}</div>
                <button class="close-modal">Fechar</button>
            </div>
        `;

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

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }
}

// Global functions for HTML onclick events
function showInventory() {
    if (window.game) window.game.showInventory();
}

function showMap() {
    if (window.game) window.game.showMap();
}

function saveGame() {
    if (window.game) window.game.saveGame();
}

function goToMenu() {
    if (window.game) window.game.goToMenu();
}

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ArithimanciaGame();
});

// Add modal styles
const gameStyle = document.createElement('style');
gameStyle.textContent = `
    .modal-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        padding: 30px;
        border-radius: 15px;
        border: 2px solid #a855f7;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
    }

    .modal-content h2 {
        color: #a855f7;
        margin-bottom: 20px;
        text-align: center;
    }

    .inventory-grid, .map-content, .save-content {
        margin-bottom: 20px;
    }

    .inventory-section, .location-item {
        background: rgba(168, 85, 247, 0.1);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        border-left: 3px solid #a855f7;
    }

    .inventory-section h3 {
        color: #a855f7;
        margin-bottom: 5px;
    }

    .close-modal {
        background: linear-gradient(135deg, #a855f7, #8b5cf6);
        border: none;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(168, 85, 247, 0.3);
    }
`;
document.head.appendChild(gameStyle);