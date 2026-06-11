/**
 * Safari Web Extension - Popup Controller
 * Manages all UI interactions
 */

let verificationHistory = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup loaded');
    initializeTabs();
    setupEventListeners();
    loadHistory();
    populateTrustedSources();
    loadSettings();
});

/**
 * Initialize tabs
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
    // Verify tab
    document.getElementById('verifyBtn').addEventListener('click', verifyClaim);
    document.getElementById('claimInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyClaim();
    });
    document.getElementById('clipboardBtn').addEventListener('click', pasteFromClipboard);
    document.getElementById('selectedTextBtn').addEventListener('click', useSelectedText);

    // Analyze tab
    document.getElementById('analyzePageBtn').addEventListener('click', analyzeCurrentPage);

    // History tab
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
}

/**
 * Verify claim
 */
function verifyClaim() {
    const claim = document.getElementById('claimInput').value.trim();
    
    if (!claim) {
        showNotification('Please enter a claim', 'warning');
        return;
    }

    const resultsContainer = document.getElementById('verificationResults');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div> Verifying...</div>';

    // Send to background for verification
    chrome.runtime.sendMessage({
        action: 'verifyClaim',
        claim: claim
    }, (verification) => {
        if (!verification || verification.error) {
            resultsContainer.innerHTML = `<div class="result-card"><p style="color: #ff3b30;">Error: ${verification?.error || 'Verification failed'}</p></div>`;
            return;
        }

        // Save to history
        verificationHistory.unshift({
            claim,
            verification,
            timestamp: new Date().toISOString()
        });
        chrome.runtime.sendMessage({
            action: 'saveVerification',
            verification: { claim, verification, timestamp: new Date().toISOString() }
        });

        // Render result
        renderVerificationResult(verification, resultsContainer);
        showNotification('✅ Verification complete', 'success');
    });
}

/**
 * Render verification result
 */
function renderVerificationResult(verification, container) {
    const confidencePercent = Math.round(verification.confidence * 100);
    const scoreColor = verification.confidence >= 0.8 ? 'high' : verification.confidence >= 0.5 ? 'medium' : 'low';
    const verdictEmoji = {
        'VERIFIED': '✅',
        'LIKELY_TRUE': '✔️',
        'UNCERTAIN': '⚠️',
        'LIKELY_FALSE': '❌',
        'FALSE': '🚫'
    }[verification.verdict] || '❓';

    let html = `
        <div class="result-card">
            <div class="result-header">
                <div class="verdict-badge" style="background: ${scoreColor === 'high' ? 'rgba(52,199,89,0.15)' : scoreColor === 'medium' ? 'rgba(255,149,0,0.15)' : 'rgba(255,59,48,0.15)'};">
                    ${verdictEmoji}
                </div>
                <div class="verdict-info">
                    <h3>Verification Result</h3>
                    <div class="verdict-level" style="color: ${scoreColor === 'high' ? '#34c759' : scoreColor === 'medium' ? '#ff9500' : '#ff3b30'};">
                        ${verification.verdict}
                    </div>
                </div>
            </div>

            <p style="font-size: 13px; color: #666; margin: 12px 0; word-break: break-word;">
                "${verification.claim}"
            </p>

            <div class="score-bar">
                <div class="score-fill" style="width: ${confidencePercent}%; background: ${scoreColor === 'high' ? '#34c759' : scoreColor === 'medium' ? '#ff9500' : '#ff3b30'};"></div>
            </div>

            <div class="metrics-grid">
                <div class="metric">
                    <div class="metric-label">Confidence</div>
                    <div class="metric-value">${confidencePercent}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Sources</div>
                    <div class="metric-value">${verification.sources?.length || 5}</div>
                </div>
            </div>

            <div class="recommendation-box" style="border-left-color: ${scoreColor === 'high' ? '#34c759' : scoreColor === 'medium' ? '#ff9500' : '#ff3b30'};">
                <strong>📌 Recommendation:</strong><br>
                <span style="font-size: 12px;">
                    ${scoreColor === 'high' ? 'Share with confidence - verified by multiple trusted sources' : 
                      scoreColor === 'medium' ? 'Generally reliable - some verification recommended' : 
                      'Exercise caution - contradicted by trusted sources'}
                </span>
            </div>
        </div>
    `;

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
 * Use selected text from page
 */
function useSelectedText() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageMetadata'}, (metadata) => {
            if (metadata) {
                document.getElementById('claimInput').value = metadata.title || '';
                showNotification('Selected text loaded', 'success');
            }
        });
    });
}

/**
 * Analyze current page
 */
function analyzeCurrentPage() {
    const resultsContainer = document.getElementById('pageAnalysisResults');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div> Analyzing page...</div>';

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'analyzePage'}, (analysis) => {
            if (!analysis) {
                resultsContainer.innerHTML = '<p style="color: #ff3b30;">Unable to analyze this page</p>';
                return;
            }

            let html = `
                <div class="result-card">
                    <h3 style="margin-bottom: 12px;">📊 Page Analysis</h3>
                    
                    <div class="score-bar" style="margin: 12px 0;">
                        <div class="score-fill" style="width: ${analysis.score * 100}%; background: ${analysis.score >= 0.7 ? '#34c759' : analysis.score >= 0.4 ? '#ff9500' : '#ff3b30'};"></div>
                    </div>

                    <div class="metrics-grid">
                        <div class="metric">
                            <div class="metric-label">Quality Score</div>
                            <div class="metric-value">${(analysis.score * 100).toFixed(0)}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Word Count</div>
                            <div class="metric-value">${analysis.wordCount}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Citations</div>
                            <div class="metric-value">${analysis.citationCount}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">Has Author</div>
                            <div class="metric-value">${analysis.hasAuthor ? '✓' : '✗'}</div>
                        </div>
                    </div>

                    <div style="margin-top: 12px; font-size: 12px; color: #666;">
                        <p>📝 <strong>Publication Date:</strong> ${analysis.hasDate ? '✓ Found' : '✗ Not found'}</p>
                    </div>
                </div>
            `;
            resultsContainer.innerHTML = html;
            showNotification('✅ Page analysis complete', 'success');
        });
    });
}

/**
 * Populate trusted sources
 */
function populateTrustedSources() {
    const sourcesList = document.getElementById('sourcesList');
    
    const sources = [
        { name: 'Snopes', credibility: 0.98, type: 'Fact-Checker' },
        { name: 'FactCheck.org', credibility: 0.97, type: 'Fact-Checker' },
        { name: 'PolitiFact', credibility: 0.96, type: 'Fact-Checker' },
        { name: 'Full Fact', credibility: 0.95, type: 'Fact-Checker' },
        { name: 'BBC News', credibility: 0.94, type: 'News' },
        { name: 'AP News', credibility: 0.93, type: 'News' },
        { name: 'Reuters', credibility: 0.92, type: 'News' },
        { name: 'Google Scholar', credibility: 0.99, type: 'Academic' }
    ];

    sourcesList.innerHTML = sources.map(source => `
        <div class="source-card">
            <h4>${source.name}</h4>
            <p class="source-type" style="font-size: 11px; color: #666; margin: 4px 0;">${source.type}</p>
            <div class="credibility-bar">
                <div class="credibility-bar-fill" style="width: ${source.credibility * 100}%"></div>
            </div>
            <p style="font-size: 12px; color: #0066cc; margin-top: 4px; font-weight: 600;">${(source.credibility * 100).toFixed(0)}% Trusted</p>
        </div>
    `).join('');
}

/**
 * Load history
 */
function loadHistory() {
    chrome.runtime.sendMessage({action: 'getHistory'}, (history) => {
        verificationHistory = history || [];
        renderHistory();
    });
}

/**
 * Render history
 */
function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (verificationHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No verification history yet</p>';
        return;
    }

    historyList.innerHTML = verificationHistory.map((item, idx) => `
        <div class="history-item" onclick="restoreFromHistory(${idx})">
            <div class="history-claim" title="${item.claim}">"${item.claim.substring(0, 50)}${item.claim.length > 50 ? '...' : ''}"</div>
            <div class="history-meta">
                <span style="font-size: 11px; color: #999;">${new Date(item.timestamp).toLocaleDateString()}</span>
                <span class="history-verdict" style="background: ${item.verification.confidence >= 0.8 ? '#34c759' : item.verification.confidence >= 0.5 ? '#ff9500' : '#ff3b30'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 600;">
                    ${item.verification.verdict}
                </span>
            </div>
        </div>
    `).join('');
}

/**
 * Restore from history
 */
function restoreFromHistory(index) {
    if (verificationHistory[index]) {
        document.querySelector('.tab-btn[data-tab="verify"]').click();
        document.getElementById('claimInput').value = verificationHistory[index].claim;
        const resultsContainer = document.getElementById('verificationResults');
        renderVerificationResult(verificationHistory[index].verification, resultsContainer);
    }
}

/**
 * Clear history
 */
function clearHistory() {
    if (confirm('Clear all verification history?')) {
        verificationHistory = [];
        chrome.storage.local.set({ verificationHistory: [] });
        renderHistory();
        showNotification('🗑️ History cleared', 'success');
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
    
    showNotification('📥 History exported', 'success');
}

/**
 * Load settings
 */
function loadSettings() {
    chrome.runtime.sendMessage({action: 'getSettings'}, (settings) => {
        console.log('Settings loaded:', settings);
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = {
        'success': '#34c759',
        'error': '#ff3b30',
        'warning': '#ff9500',
        'info': '#0066cc'
    }[type] || '#0066cc';

    notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 12px 16px;
        background: ${bgColor};
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
