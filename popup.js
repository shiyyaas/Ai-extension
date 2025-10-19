document.getElementById("actionBtn").addEventListener("click", async () => {
  if (!("ai" in self) || !("languageModel" in ai)) {
    alert("Built-in AI not available in this Chrome version.");
    return;
  }

  const capabilities = await ai.languageModel.capabilities();
  if (capabilities.available === "no") {
    alert("Gemini Nano not available on this device.");
    return;
  }

  const session = await ai.languageModel.create();
  const prompt = "Tell me something that would make me happy";
  const result = await session.prompt(prompt);
  alert(result);
});