// Get your button
const actionBtn = document.getElementById('actionBtn'); // or however you select it

// popup.js
document.getElementById('downloadButton').addEventListener('click', async () => {
  try {
    const session = await ai.languageModel.create();
    console.log('Session created!', session);
    
    const result = await session.prompt('Say hello!');
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error);
  }
});