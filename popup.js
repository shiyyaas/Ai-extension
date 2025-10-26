// Get your button
const actionBtn = document.getElementById('actionBtn'); // or however you select it

  const button = document.getElementById('downloadButton');
  const progress = document.getElementById('progress');
  const output = document.getElementById('output');

  button.addEventListener('click', async () => {
    output.textContent = 'Checking model availability...';
    const availability = await LanguageModel.availability();
    
    if (availability === 'downloadable' || availability === 'downloading') {
      output.textContent = 'Downloading model...';
      progress.hidden = false;

      const session = await LanguageModel.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            progress.value = e.loaded;
            output.textContent = `Model download: ${(e.loaded * 100).toFixed(1)}%`;
          });
        }
      });

      output.textContent = 'Model ready to use!';
      progress.hidden = true;
    } 
    else if (availability === 'available') {
      output.textContent = 'Model already available.';
    } 
    else {
      output.textContent = 'Model unavailable on this device.';
    }
  });