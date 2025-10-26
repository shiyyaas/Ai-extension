// Get your button
const actionBtn = document.getElementById('actionBtn'); // or however you select it

// Add click listener
actionBtn.addEventListener('click', async () => {
  // Check if user clicked (this should be true since they just clicked!)
  if (navigator.userActivation.isActive) {
    try {
      // Now create your AI session
      // For example, with Summarizer:
      //const summarizer = await ai.summarizer.create();
      
      // Or with Prompt API:
      //const session = await ai.languageModel.create();
      const session = await ai.languageModel.create();
      // Use it here...
      alert('AI is ready!');
      
    } catch (error) {
      alert(error)
      alert('Error creating AI session:', error);
    }
  } else {
    alert('No user activation detected');
  }
});