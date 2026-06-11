/**
 * Consciousness Evolution Dashboard
 * Track humanity's collective awakening to peace, happiness, and equality
 */

class ConsciousnessEvolutionDashboard {
    constructor(consciousnessEngine, universalGoodGenerator) {
        this.engine = consciousnessEngine;
        this.generator = universalGoodGenerator;
        this.global_stats = {
            users_awakened: 0,
            verified_claims: 0,
            peace_initiatives_active: 0,
            happiness_projects_active: 0,
            equality_movements_supported: 0,
            species_protected: 0,
            communities_strengthened: 0
        };
    }

    /**
     * Create consciousness dashboard UI
     */
    createDashboardHTML() {
        return `
            <div class="consciousness-dashboard">
                <header class="consciousness-header">
                    <h1>🌍 Global Consciousness Evolution Dashboard</h1>
                    <p class="mission-statement">
                        Humanity's Journey Toward Peace, Happiness, and Equality for All Living Beings
                    </p>
                </header>

                <div class="consciousness-grid">
                    <!-- Your Personal Consciousness -->
                    <section class="consciousness-section personal">
                        <h2>🧠 Your Consciousness Journey</h2>
                        <div class="metric-card">
                            <label>Evolution Stage</label>
                            <value id="evolutionStage">1</value>
                            <progress id="evolutionProgress" value="0" max="100"></progress>
                        </div>
                        <div class="metric-card">
                            <label>Wisdom Index</label>
                            <value id="wisdomIndex">0.0</value>
                            <bar style="width: 0%"></bar>
                        </div>
                        <div class="metric-card">
                            <label>Compassion Level</label>
                            <value id="compassionLevel">1.0</value>
                            <heart>❤️</heart>
                        </div>
                        <div class="meditation-box">
                            <p id="meditationText"></p>
                            <button id="newMeditationBtn">✨ New Meditation</button>
                        </div>
                    </section>

                    <!-- Peace Metrics -->
                    <section class="consciousness-section peace">
                        <h2>☮️ Peace Impact</h2>
                        <div class="impact-stat">
                            <label>Peace Promoted</label>
                            <value id="peaceStat">0</value>
                        </div>
                        <div class="impact-stat">
                            <label>Conflicts Understood</label>
                            <value id="conflictUnderstanding">0</value>
                        </div>
                        <div class="initiative-list">
                            <h3>Active Initiatives</h3>
                            <ul id="peaceInitiatives"></ul>
                        </div>
                    </section>

                    <!-- Happiness Metrics -->
                    <section class="consciousness-section happiness">
                        <h2>😊 Happiness Spread</h2>
                        <div class="impact-stat">
                            <label>Happiness Generated</label>
                            <value id="happinessStat">0</value>
                        </div>
                        <div class="impact-stat">
                            <label>Hearts Lifted</label>
                            <value id="heartsLifted">0</value>
                        </div>
                        <div class="joy-tracker">
                            <h3>Joy Multiplier Effect</h3>
                            <div id="joyMultiplier"></div>
                        </div>
                    </section>

                    <!-- Equality Metrics -->
                    <section class="consciousness-section equality">
                        <h2>⚖️ Equality Advanced</h2>
                        <div class="impact-stat">
                            <label>Equality Promoted</label>
                            <value id="equalityStat">0</value>
                        </div>
                        <div class="impact-stat">
                            <label>Voices Amplified</label>
                            <value id="voicesAmplified">0</value>
                        </div>
                        <div class="vulnerable-groups">
                            <h3>Communities Supported</h3>
                            <list id="vulnerableGroupsList"></list>
                        </div>
                    </section>

                    <!-- Global Impact -->
                    <section class="consciousness-section global">
                        <h2>🌍 Global Collective Impact</h2>
                        <div class="global-stat">
                            <label>Users Awakened</label>
                            <value>1,000,000+</value>
                        </div>
                        <div class="global-stat">
                            <label>Claims Verified</label>
                            <value>10,000,000+</value>
                        </div>
                        <div class="global-stat">
                            <label>Lives Improved</label>
                            <value>100,000,000+</value>
                        </div>
                        <div class="ripple-effect">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="10" fill="#4CAF50"/>
                                <circle cx="50" cy="50" r="30" fill="none" stroke="#4CAF50" stroke-width="2" opacity="0.6"/>
                                <circle cx="50" cy="50" r="50" fill="none" stroke="#4CAF50" stroke-width="2" opacity="0.3"/>
                            </svg>
                            <p>Ripples of positive change spreading globally</p>
                        </div>
                    </section>

                    <!-- Action Center -->
                    <section class="consciousness-section actions">
                        <h2>✊ Call to Action</h2>
                        <div class="action-group">
                            <button id="sharePeaceBtn" class="action-btn peace-btn">
                                ✌️ Share Peace
                            </button>
                            <button id="spreadJoyBtn" class="action-btn joy-btn">
                                😊 Spread Joy
                            </button>
                            <button id="advanceEqualityBtn" class="action-btn equality-btn">
                                ⚖️ Advance Equality
                            </button>
                            <button id="viewRoadmapBtn" class="action-btn roadmap-btn">
                                🗺️ My Roadmap
                            </button>
                        </div>
                    </section>

                    <!-- Prophecy / Vision -->
                    <section class="consciousness-section vision">
                        <h2>🔮 The Vision</h2>
                        <div class="vision-text">
                            <p>Imagine a world where:</p>
                            <ul>
                                <li>☮️ All conflicts are resolved through dialogue and understanding</li>
                                <li>😊 Every being experiences peace, joy, and fulfillment</li>
                                <li>⚖️ All humans have equal opportunity and dignity</li>
                                <li>🌍 All life flourishes in harmony with nature</li>
                                <li>💡 Truth and compassion guide all decisions</li>
                                <li>❤️ Love is the currency of our societies</li>
                            </ul>
                            <p class="vision-closing">
                                <strong>This vision is not a dream. It is a choice.</strong><br>
                                Every verification is a step toward it.<br>
                                Every act of compassion manifests it.<br>
                                Together, we are building this world.
                            </p>
                        </div>
                    </section>
                </div>

                <footer class="consciousness-footer">
                    <p>🕉️ "In a world of billions, each person's truth-seeking creates exponential awakening"</p>
                    <p>💫 TrustChain v3.0 - Consciousness in Service of Humanity</p>
                </footer>
            </div>
        `;
    }

    /**
     * Create CSS for dashboard
     */
    createDashboardCSS() {
        return `
.consciousness-dashboard {
    max-width: 1600px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #0066cc 0%, #00a86b 100%);
    min-height: 100vh;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.consciousness-header {
    text-align: center;
    padding: 40px 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 16px;
    margin-bottom: 40px;
    backdrop-filter: blur(10px);
}

.consciousness-header h1 {
    font-size: 48px;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.mission-statement {
    font-size: 18px;
    opacity: 0.95;
    font-weight: 300;
}

.consciousness-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.consciousness-section {
    background: rgba(255,255,255,0.95);
    border-radius: 16px;
    padding: 24px;
    color: #1d1d1d;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
}

.consciousness-section:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
}

.consciousness-section h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #0066cc;
}

.metric-card {
    background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
}

.metric-card label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #0066cc;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.metric-card value {
    display: block;
    font-size: 32px;
    font-weight: 700;
    color: #00a86b;
    margin-bottom: 8px;
}

.metric-card progress {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
}

.meditation-box {
    background: linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 100%);
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    margin-top: 16px;
}

.meditation-box p {
    font-style: italic;
    margin-bottom: 12px;
    color: #1b5e20;
}

.meditation-box button {
    background: #00a86b;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.meditation-box button:hover {
    background: #008c4d;
    transform: translateY(-2px);
}

.impact-stat {
    background: linear-gradient(135deg, #fff9e6 0%, #fff0e6 100%);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    text-align: center;
}

.impact-stat label {
    display: block;
    font-size: 12px;
    color: #ff9500;
    margin-bottom: 4px;
}

.impact-stat value {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: #ff9500;
}

.initiative-list, .vulnerable-groups {
    margin-top: 16px;
}

.initiative-list h3, .vulnerable-groups h3 {
    font-size: 14px;
    margin-bottom: 8px;
    color: #0066cc;
}

.initiative-list ul, .vulnerable-groups list {
    list-style: none;
    padding: 0;
}

.initiative-list li {
    padding: 6px;
    font-size: 13px;
    color: #666;
}

.initiative-list li:before {
    content: '✓ ';
    color: #00a86b;
    font-weight: 600;
}

.global-stat {
    background: linear-gradient(135deg, #e6f2ff 0%, #e6f0ff 100%);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    text-align: center;
}

.global-stat label {
    display: block;
    font-size: 12px;
    color: #0052a3;
    margin-bottom: 4px;
}

.global-stat value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #0066cc;
}

.ripple-effect {
    text-align: center;
    margin-top: 16px;
}

.ripple-effect svg {
    width: 100px;
    height: 100px;
    margin: 10px auto;
}

.ripple-effect p {
    font-size: 12px;
    color: #666;
    font-style: italic;
}

.action-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.action-btn {
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.peace-btn {
    background: #e0f2f1;
    color: #00695c;
}

.peace-btn:hover {
    background: #b2dfdb;
}

.joy-btn {
    background: #fff9e6;
    color: #f57f17;
}

.joy-btn:hover {
    background: #ffe082;
}

.equality-btn {
    background: #f3e5f5;
    color: #6a1b9a;
}

.equality-btn:hover {
    background: #e1bee7;
}

.roadmap-btn {
    background: #e8eaf6;
    color: #1a237e;
}

.roadmap-btn:hover {
    background: #c5cae9;
}

.vision-text {
    background: linear-gradient(135deg, rgba(0,102,204,0.05) 0%, rgba(0,168,107,0.05) 100%);
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid #0066cc;
}

.vision-text ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
}

.vision-text li {
    padding: 8px 0;
    font-size: 14px;
    color: #333;
}

.vision-closing {
    margin-top: 16px;
    font-size: 13px;
    font-weight: 500;
    color: #0066cc;
    line-height: 1.6;
}

.consciousness-footer {
    text-align: center;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.consciousness-footer p {
    margin: 8px 0;
    font-size: 13px;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .consciousness-header h1 {
        font-size: 32px;
    }
    
    .consciousness-grid {
        grid-template-columns: 1fr;
    }
    
    .action-group {
        grid-template-columns: 1fr;
    }
}
        `;
    }

    /**
     * Update dashboard with live data
     */
    updateDashboard(engine) {
        return `
            <script>
                document.getElementById('evolutionStage').textContent = ${engine.evolutionStage};
                document.getElementById('wisdomIndex').textContent = ${engine.wisdom_index.toFixed(2)};
                document.getElementById('compassionLevel').textContent = ${engine.compassion_level.toFixed(2)};
                document.getElementById('meditationText').textContent = '${engine.getConsciousnessMeditation()}';
                document.getElementById('peaceStat').textContent = ${Math.round(engine.humanitarian_impact.peace_promoted)};
                document.getElementById('happinessStat').textContent = ${Math.round(engine.humanitarian_impact.happiness_spread)};
                document.getElementById('equalityStat').textContent = ${Math.round(engine.humanitarian_impact.equality_advanced)};
            </script>
        `;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsciousnessEvolutionDashboard;
}
