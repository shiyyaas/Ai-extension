// Get your button
const actionBtn = document.getElementById('actionBtn'); // or however you select it

  const button = document.getElementById('downloadButton');

  button.addEventListener('click', async () => {
    try {
      const availability = await LanguageModel.availability();

      if (availability === 'downloadable' || availability === 'downloading') {
        console.log('Downloading model — please wait...');
        await LanguageModel.create({
          expectedInputs: [
            { type: "text", languages: ["en"] } // input from system/user is English
          ],
          expectedOutputs: [
            { type: "text", languages: ["en"] } // specify desired output language
          ],
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Progress: ${(e.loaded * 100).toFixed(1)}%`);
            });
          }
        });
        console.log('Model downloaded and ready to use!');
      } else if (availability === 'available') {
        console.log('Model already available.');
      } else {
        console.log('LanguageModel unavailable on this device.');
      }
    } catch (e) {
      console.error('Error:', e);
    }
  });