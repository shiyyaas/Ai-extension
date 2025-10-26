// Get your button
const actionBtn = document.getElementById('actionBtn'); // or however you select it

document.getElementById('downloadButton').addEventListener('click', async () => {
  try {
    alert('Starting model download... This may take a while!');
    
    const session = await ai.languageModel.create();
    
    alert('Model downloaded and session created successfully!');
    
    // Now test it with a prompt
    const result = await session.prompt('Say hello!');
    
    alert('AI response: ' + result);
    
  } catch (error) {
    alert('Error: ' + error.message);
    console.error('Full error:', error);
  }
});