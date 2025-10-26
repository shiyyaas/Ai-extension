document.getElementById("actionBtn").addEventListener("click", async () => {
  try {
    if (!("ai" in self) || !("languageModel" in ai)) {
      alert("Built-in AI not available. Update to Chrome 138+ and enable required flags.");
      return;
    }

    const availability = await ai.languageModel.availability();

    if (availability === "no") {
      alert("Gemini Nano not available on this device.");
      return;
    } else if (availability === "downloadable") {
      alert("Model downloadable — enable it via chrome://components → Optimization Guide On Device Model → Check for update.");
      return;
    } else if (availability === "downloading") {
      alert("Model currently downloading. Please wait until it completes.");
      return;
    }

    const session = await ai.languageModel.create({
      systemPrompt: "You are a friendly assistant that makes the user smile.",
      temperature: 0.7
    });

    const result = await session.prompt("Tell me something that would make me happy.");
    alert(result);

    await session.destroy();
  } catch (err) {
    console.error(err);
    alert("Error using Prompt API: " + err.message);
  }
});
