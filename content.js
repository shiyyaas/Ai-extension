let luminaButton = null;
let luminaPopup = null;
let session = null;
let selectedText = '';

// Initialize AI session
async function initAI() {
  try {
    const capabilities = await LanguageModel.capabilities();
    if (capabilities.available === 'readily') {
      session = await LanguageModel.create();
      console.log('Lumina AI initialized');
    }
  } catch (error) {
    console.error('Lumina AI initialization failed:', error);
  }
}

// Create floating action button
function createLuminaButton() {
  if (luminaButton) return luminaButton;

  luminaButton = document.createElement('div');
  luminaButton.id = 'lumina-float-button';
  luminaButton.innerHTML = `
    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  `;

  luminaButton.addEventListener('click', (e) => {
    e.stopPropagation();
    showActionMenu();
  });

  return luminaButton;
}

// Create action popup
function createActionPopup() {
  if (luminaPopup) return luminaPopup;

  luminaPopup = document.createElement('div');
  luminaPopup.id = 'lumina-popup';
  luminaPopup.innerHTML = `
    <div class="lumina-popup-content">
      <div class="lumina-actions">
        <button class="lumina-action-btn" data-action="summarize">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          Summarize
        </button>
        <button class="lumina-action-btn" data-action="explain">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Explain
        </button>
        <button class="lumina-action-btn" data-action="simplify">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
          Simplify
        </button>
        <button class="lumina-action-btn" data-action="key-points">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
          Key Points
        </button>
      </div>
      <div class="lumina-result hidden">
        <div class="lumina-result-header">
          <button class="lumina-back-btn">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
          <span class="lumina-result-title"></span>
          <button class="lumina-copy-btn" title="Copy to clipboard">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
        <div class="lumina-result-content">
          <div class="lumina-loading">
            <div class="lumina-spinner"></div>
            <span>Processing...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  luminaPopup.querySelectorAll('.lumina-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      handleAction(action);
    });
  });

  luminaPopup.querySelector('.lumina-back-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showActionMenu();
  });

  luminaPopup.querySelector('.lumina-copy-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    copyResult();
  });

  return luminaPopup;
}

// Show action menu
function showActionMenu() {
  const actionsDiv = luminaPopup.querySelector('.lumina-actions');
  const resultDiv = luminaPopup.querySelector('.lumina-result');
  actionsDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
}

// Handle text selection
document.addEventListener('mouseup', (e) => {
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0) {
      selectedText = text;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Show button
      const btn = createLuminaButton();
      btn.style.left = `${rect.left + window.scrollX + rect.width / 2 - 20}px`;
      btn.style.top = `${rect.top + window.scrollY - 50}px`;
      btn.classList.add('lumina-visible');
      document.body.appendChild(btn);
    } else {
      hideLumina();
    }
  }, 10);
});

// Hide Lumina elements
function hideLumina() {
  if (luminaButton) {
    luminaButton.classList.remove('lumina-visible');
  }
  if (luminaPopup) {
    luminaPopup.classList.remove('lumina-visible');
  }
}

// Handle AI actions
async function handleAction(action) {
  if (!session) {
    showResult(action, 'AI not initialized. Please open the extension popup to set up.');
    return;
  }

  const actionsDiv = luminaPopup.querySelector('.lumina-actions');
  const resultDiv = luminaPopup.querySelector('.lumina-result');
  const resultContent = resultDiv.querySelector('.lumina-result-content');
  const resultTitle = resultDiv.querySelector('.lumina-result-title');

  // Show loading
  actionsDiv.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  resultTitle.textContent = action.charAt(0).toUpperCase() + action.slice(1).replace('-', ' ');
  resultContent.innerHTML = `
    <div class="lumina-loading">
      <div class="lumina-spinner"></div>
      <span>Processing...</span>
    </div>
  `;

  // Show popup near button
  if (luminaButton) {
    const rect = luminaButton.getBoundingClientRect();
    luminaPopup.style.left = `${rect.left + window.scrollX}px`;
    luminaPopup.style.top = `${rect.top + window.scrollY + 50}px`;
    luminaPopup.classList.add('lumina-visible');
    document.body.appendChild(luminaPopup);
  }

  try {
    const prompts = {
      'summarize': `Summarize the following text in 2-3 concise sentences:\n\n${selectedText}`,
      'explain': `Explain the following text in simple terms:\n\n${selectedText}`,
      'simplify': `Rewrite the following text in simpler language that's easy to understand:\n\n${selectedText}`,
      'key-points': `Extract the key points from the following text as a bullet list:\n\n${selectedText}`
    };

    const result = await session.prompt(prompts[action]);
    showResult(action, result);
  } catch (error) {
    showResult(action, `Error: ${error.message}`);
  }
}

// Show result
function showResult(action, text) {
  const resultContent = luminaPopup.querySelector('.lumina-result-content');
  resultContent.innerHTML = `<p>${text}</p>`;
}

// Copy result to clipboard
function copyResult() {
  const resultText = luminaPopup.querySelector('.lumina-result-content p')?.textContent;
  if (resultText) {
    navigator.clipboard.writeText(resultText).then(() => {
      const copyBtn = luminaPopup.querySelector('.lumina-copy-btn');
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
      }, 2000);
    });
  }
}

// Close on click outside
document.addEventListener('click', (e) => {
  if (luminaPopup && !luminaPopup.contains(e.target) && 
      luminaButton && !luminaButton.contains(e.target)) {
    hideLumina();
  }
});

// Initialize
createActionPopup();
initAI();