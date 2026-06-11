/**
 * Safari Extension Popup Controller
 * Manages UI interactions and model integration
 */

let trustChainEngine = new TrustChainVerificationEngine();
let verificationHistory = [];

document.addEventListener('DOMContentLoaded', async () => {
    initializeTabs();
    setupEventListeners();
    loadHistory();
    populateTrustedSources();
    console.log('TrustChain initialized:', trustChainEngine.getStats());
});

/**
 * Initialize tab switching
 */
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Verify claim
    document.getElementById('verifyBtn').addEventListener('click', verifyClaim);
    document.getElementById('claimInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyClaim();
    });

    // Quick actions
    document.getElementById('clipboardBtn').addEventListener('click', pasteFromClipboard);
    document.getElementById('selectedTextBtn').addEventListener('click', useSelectedText);

    // Analyze page
    document.getElementById('analyzePageBtn').addEventListener('click', analyzeCurrentPage);

    // History
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
}

/**
 * Verify claim
 */
async function verifyClaim() {
    const claim = document.getElementById('claimInput').value.trim();
    
    if (!claim) {
        showNotification('Please enter a claim to verify', 'warning');
        return;
    }

    const resultsContainer = document.getElementById('verificationResults');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div> Verifying...</div>';

    try {
        const result = await trustChainEngine.verifyClaim(claim);
        
        if (result.success === false) {
            throw new Error(result.error);
        }

        // Add to history
        verificationHistory.unshift({
            claim,
            result,
            timestamp: new Date().toISOString()
        });
        saveHistory();

        // Render result
        renderVerificationResult(result, resultsContainer);
        showNotification('Verification complete', 'success');
    } catch (error) {
        console.error('Verification failed:', error);
        resultsContainer.innerHTML = `<div class="result-card"><p style="color: var(--danger);">Error: ${error.message}</p></div>`;
        showNotification('Verification failed', 'error');
    }
}

/**
 * Render verification result
 */
function renderVerificationResult(result, container) {
    const confidencePercent = Math.round(result.confidence * 100);
    const scoreColor = result.confidence >= 0.8 ? 'high' : result.confidence >= 0.5 ? 'medium' : 'low';
    const verdictLevel = result.recommendation.level.toLowerCase().replace(/_/g, '_');

    let html = `
        <div class="result-card">
            <div class="result-header">
                <div class="verdict-badge ${verdictLevel}">
                    ${result.recommendation.emoji}
                </div>
                <div class="verdict-info">
                    <h3>Verification Result</h3>
                    <div class="verdict-level ${verdictLevel}">${result.recommendation.level}</div>
                </div>
            </div>

            <p style="font-size: 13px; color: var(--text-secondary); margin: 12px 0;">
                "${result.claim}"
            </p>

            <div class="score-bar">
                <div class="score-fill ${scoreColor}" style="width: ${confidencePercent}%"></div>
            </div>

            <div class="metrics-grid">
                <div class="metric">
                    <div class="metric-label">Confidence</div>
                    <div class="metric-value">${confidencePercent}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Sources Checked</div>
                    <div class="metric-value">${result.sources_checked}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Trustworthy Sources</div>
                    <div class="metric-value">${result.credibilityScore.trustworthinessRatio.toFixed(1)}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Consistency</div>
                    <div class="metric-value">${(result.credibilityScore.consistency * 100).toFixed(0)}%</div>
                </div>
            </div>

            <div class="recommendation-box ${scoreColor}">
                <strong>📌 Recommendation:</strong><br>
                ${result.recommendation.description}
            </div>
    `;

    // Add bias analysis
    if (result.biasAnalysis.detected) {
        html += `
            <div class="bias-indicator" style="margin-top: 12px;">
                <div class="bias-level ${result.biasAnalysis.level}"></div>
                <span><strong>Bias Detected (${result.biasAnalysis.level}):</strong> ${result.biasAnalysis.recommendation}</span>
            </div>
        `;
    }

    // Add contradictions
    if (result.contradictions.found) {
        html += `
            <div style="margin-top: 12px; padding: 10px; background: rgba(255,59,48,0.1); border-radius: 6px; border-left: 3px solid var(--danger);">
                <strong style="color: var(--danger);">⚠️ Contradictions Found:</strong><br>
                <font size="12px">Sources disagree on this claim. ${result.contradictions.count} contradiction(s) detected.</font>
            </div>
        `;
    }

    // Add sources
    if (result.sources && result.sources.length > 0) {
        html += '<div class="sources-list"><h4>Referenced Sources</h4>';
        result.sources.slice(0, 5).forEach(source => {
            const credLevel = source.credibility >= 0.9 ? 'high' : source.credibility >= 0.7 ? 'medium' : 'low';
            html += `
                <div class="source-item">
                    <div class="source-credibility ${credLevel}"></div>
                    <span><strong>${source.domain}</strong> (${(source.credibility * 100).toFixed(0)}% credible)</span>
                </div>
            `;
        });
        html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Paste from clipboard
 */
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('claimInput').value = text;
        verifyClaim();
    } catch (error) {
        showNotification('Unable to access clipboard', 'error');
    }
}

/**
 * Use selected text
 */
function useSelectedText() {
    safari.extension.dispatchMessage('getSelectedText', {}, (response) => {
        if (response && response.text) {
            document.getElementById('claimInput').value = response.text;
            verifyClaim();
        } else {
            showNotification('No text selected', 'warning');
        }
    });
}

/**
 * Analyze current page
 */
async function analyzeCurrentPage() {
    const resultsContainer = document.getElementById('pageAnalysisResults');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div> Analyzing page...</div>';

    try {
        safari.extension.dispatchMessage('analyzePageContent', {}, async (response) => {
            if (!response || !response.content) {
                throw new Error('Unable to access page content');
            }

            const analysis = await trustChainEngine.analyzeWebpage(response.url, response.content);

            let html = `
                <div class="result-card">
                    <h3>Page Analysis: ${new URL(response.url).hostname}</h3>
                    
                    <div class="score-bar" style="margin: 12px 0;">
                        <div class="score-fill ${analysis.score >= 0.7 ? 'high' : analysis.score >= 0.4 ? 'medium' : 'low'}" 
                             style="width: ${analysis.score * 100}%"></div>
                    </div>

                    <div class="metrics-grid">
                        <div class="metric">
                            <div class="metric-label">Overall Score</div>
                            <div class="metric-value">${(analysis.score * 100).toFixed(0)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Source Credibility</div>
                            <div class="metric-value">${(analysis.sourceCredibility * 100).toFixed(0)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Word Count</div>
                            <div class="metric-value">${analysis.contentAnalysis.wordCount}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Citations</div>
                            <div class="metric-value">${analysis.contentAnalysis.citationCount}</div>
                        </div>
                    </div>

                    <div style="margin-top: 12px;">
                        <h4 style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Content Quality:</h4>
                        <ul style="font-size: 12px; list-position: inside; color: var(--text-secondary);">
                            <li>Has Author: ${analysis.contentAnalysis.hasAuthor ? '✓' : '✗'}</li>
                            <li>Has Publication Date: ${analysis.contentAnalysis.hasDate ? '✓' : '✗'}</li>
                            <li>Paragraph Structure: ${analysis.contentAnalysis.paragraphCount} paragraphs</li>
                        </ul>
                    </div>
            `;

            if (analysis.warnings.length > 0) {
                html += '<div style="margin-top: 12px;"><h4 style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">⚠️ Warnings:</h4>';
                analysis.warnings.forEach(warning => {
                    html += `<div class="warning-badge">${warning}</div>`;
                });
                html += '</div>';
            }

            html += '</div>';
            resultsContainer.innerHTML = html;
            showNotification('Page analysis complete', 'success');
        });
    } catch (error) {
        console.error('Analysis failed:', error);
        resultsContainer.innerHTML = `<div class="result-card"><p style="color: var(--danger);">Error: ${error.message}</p></div>`;
        showNotification('Analysis failed', 'error');
    }
}

/**
 * Populate trusted sources
 */
function populateTrustedSources() {
    const sourcesList = document.getElementById('sourcesList');
    const stats = trustChainEngine.getStats();
    
    // Get sources from engine
    const sources = [
        { name: 'Snopes', domain: 'snopes.com', credibility: 0.98, type: 'fact-checker' },
        { name: 'FactCheck.org', domain: 'factcheck.org', credibility: 0.97, type: 'fact-checker' },
        { name: 'PolitiFact', domain: 'politifact.com', credibility: 0.96, type: 'fact-checker' },
        { name: 'Full Fact', domain: 'fullfact.org', credibility: 0.95, type: 'fact-checker' },
        { name: 'BBC News', domain: 'bbc.com', credibility: 0.94, type: 'news' },
        { name: 'AP News', domain: 'apnews.com', credibility: 0.93, type: 'news' },
        { name: 'Reuters', domain: 'reuters.com', credibility: 0.92, type: 'news' },
        { name: 'Google Scholar', domain: 'scholar.google.com', credibility: 0.99, type: 'academic' }
    ];

    sourcesList.innerHTML = sources.map(source => `
        <div class="source-card">
            <h4>${source.name}</h4>
            <div class="source-credibility-score">${source.type}</div>
            <div class="credibility-bar">
                <div class="credibility-bar-fill" style="width: ${source.credibility * 100}%"></div>
            </div>
            <span class="source-type">${(source.credibility * 100).toFixed(0)}% Trusted</span>
        </div>
    `).join('');
}

/**
 * Load verification history
 */
function loadHistory() {
    chrome.storage.local.get('verificationHistory', (data) => {
        if (data.verificationHistory) {
            verificationHistory = data.verificationHistory;
            renderHistory();
        }
    });
}

/**
 * Save verification history
 */
function saveHistory() {
    chrome.storage.local.set({ verificationHistory: verificationHistory.slice(0, 50) }); // Keep last 50
}

/**
 * Render history
 */
function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (verificationHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No verification history yet</p>';
        return;
    }

    historyList.innerHTML = verificationHistory.map(item => `
        <div class="history-item" onclick="restoreFromHistory('${item.claim}')">
            <div class="history-claim">"${item.claim.substring(0, 60)}${item.claim.length > 60 ? '...' : ''}"</div>
            <div class="history-meta">
                <span>${new Date(item.timestamp).toLocaleDateString()}</span>
                <span class="history-verdict">${item.result.recommendation.level}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Restore from history
 */
function restoreFromHistory(claim) {
    document.querySelector('.tab-btn[data-tab="verify"]').click();
    document.getElementById('claimInput').value = claim;
    verifyClaim();
}

/**
 * Clear history
 */
function clearHistory() {
    if (confirm('Clear all verification history?')) {
        verificationHistory = [];
        saveHistory();
        renderHistory();
        showNotification('History cleared', 'success');
    }
}

/**
 * Export history
 */
function exportHistory() {
    if (verificationHistory.length === 0) {
        showNotification('No history to export', 'warning');
        return;
    }

    const data = JSON.stringify(verificationHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trustchain-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('History exported', 'success');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : type === 'warning' ? '#ff9500' : '#0066cc'};
        color: white;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
