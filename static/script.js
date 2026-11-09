
// Translate text
async function translateText() {

    const text = document.getElementById("inputText").value.trim();
    const source = document.getElementById("sourceLanguage").value;
    const target = document.getElementById("targetLanguage").value;
    const output = document.getElementById("outputText");

    if (!text) {
        alert("Please enter some text.");
        return;
    }

    output.value = "Translating...";

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                source: source,
                target: target
            })
        });

        const data = await response.json();

        if (!response.ok) {
            output.value = data.error || "Translation service error.";
            return;
        }

        if (data.translatedText) {
            output.value = data.translatedText;
        } else {
            output.value = data.error || "No translation received.";
        }

    } catch (error) {
        console.error("Translation Error:", error);
        output.value = "Unable to connect to the translation server. Please try again.";
    }
}


// Copy translated text
async function copyText() {

    const output = document.getElementById("outputText").value;

    if (!output || output === "Translating...") {
        alert("Nothing to copy.");
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        alert("Copied successfully!");
    } catch (error) {
        alert("Unable to copy text.");
    }
}


// Speak translated text
function speakText() {

    const text = document.getElementById("outputText").value;

    if (!text || text === "Translating...") {
        alert("Nothing to speak.");
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    const languageCodes = {
        en: "en-US",
        te: "te-IN",
        hi: "hi-IN",
        kn: "kn-IN",
        ta: "ta-IN",
        ml: "ml-IN"
    };

    const targetLanguage =
        document.getElementById("targetLanguage").value;

    speech.lang = languageCodes[targetLanguage] || targetLanguage;

    window.speechSynthesis.speak(speech);
}


// Swap languages
function swapLanguages() {

    const source = document.getElementById("sourceLanguage");
    const target = document.getElementById("targetLanguage");

    const input = document.getElementById("inputText");
    const output = document.getElementById("outputText");

    const tempLang = source.value;
    source.value = target.value;
    target.value = tempLang;

    const tempText = input.value;
    input.value = output.value;
    output.value = tempText;
}
