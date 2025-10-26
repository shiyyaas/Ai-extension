let session = null;

async function checkAIAvailability() {
  const statusDiv = document.getElementById('status');
  const downloadSection = document.getElementById('downloadSection');

  try {
    const availability = await ai.languageModel.capabilities();

    if (availability.available === 'readily') {
      statusDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          <span class="text-sm text-gray-600">AI Ready • Select text to begin</span>
        </div>
      `;
      // Initialize session
      session = await ai.languageModel.create();
    } else if (availability.available === 'after-download') {
      statusDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span class="text-sm text-gray-600">AI model needs download</span>
        </div>
      `;
      downloadSection.classList.remove('hidden');
    } else {
      statusDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-red-400 rounded-full"></div>
          <span class="text-sm text-gray-600">AI not available on this device</span>
        </div>
      `;
    }
  } catch (error) {
    statusDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-400 rounded-full"></div>
        <span class="text-sm text-gray-600">Error checking AI: ${error.message}</span>
      </div>
    `;
  }
}

document.getElementById('downloadButton')?.addEventListener('click', async () => {
  const downloadButton = document.getElementById('downloadButton');
  const downloadProgress = document.getElementById('downloadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  try {
    downloadButton.disabled = true;
    downloadButton.textContent = 'Preparing download...';
    downloadProgress.classList.remove('hidden');

    session = await ai.languageModel.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          const percent = (e.loaded / e.total * 100).toFixed(1);
          progressBar.style.width = `${percent}%`;
          progressPercent.textContent = `${percent}%`;
        });
      }
    });

    downloadButton.textContent = '✓ Download Complete';
    setTimeout(() => {
      checkAIAvailability();
      document.getElementById('downloadSection').classList.add('hidden');
    }, 1500);

  } catch (error) {
    downloadButton.disabled = false;
    downloadButton.textContent = 'Retry Download';
    alert('Download failed: ' + error.message);
  }
});

// Initialize
checkAIAvailability();