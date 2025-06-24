// यह सुनिश्चित करता है कि पूरा HTML लोड होने के बाद ही स्क्रिप्ट चले
document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const textInput = document.getElementById('text-input');
    
    const wordsCountEl = document.getElementById('words-count');
    const charsCountEl = document.getElementById('chars-count');
    const sentencesCountEl = document.getElementById('sentences-count');
    const paragraphsCountEl = document.getElementById('paragraphs-count');
    
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    // 2. आँकड़ों को अपडेट करने और एनिमेट करने के लिए एक हेल्पर फंक्शन
    const updateStat = (element, value) => {
        element.textContent = value;
        // एनिमेशन के लिए 'updated' क्लास जोड़ना
        element.classList.add('updated');
        // 200 मिलीसेकंड के बाद क्लास को हटाना ताकि अगली बार फिर एनिमेशन हो सके
        setTimeout(() => {
            element.classList.remove('updated');
        }, 200);
    };

    // 3. मुख्य फंक्शन जो सभी गणना करेगा
    const calculateStats = () => {
        const text = textInput.value;

        // शब्दों की गिनती
        // टेक्स्ट को खाली जगह (space, newline) से अलग करके गिनना
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        updateStat(wordsCountEl, words.length);

        // अक्षरों की गिनती
        updateStat(charsCountEl, text.length);

        // वाक्यों की गिनती
        // टेक्स्ट को '.', '!', '?' से अलग करके गिनना
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        updateStat(sentencesCountEl, sentences.length);

        // पैराग्राफ की गिनती
        // टेक्स्ट को नई लाइनों से अलग करके गिनना
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        updateStat(paragraphsCountEl, paragraphs.length);
    };

    // =================================================================
// 4. एक्शन बटन्स के लिए इवेंट लिस्नर (नया और बेहतर कोड)
// =================================================================

// कॉपी होने पर यूजर को फीडबैक दिखाने के लिए एक हेल्पर फंक्शन
const showCopyFeedback = () => {
    const originalText = copyBtn.innerHTML;
    copyBtn.disabled = true; // बटन को अस्थायी रूप से डिसेबल करें
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.disabled = false;
    }, 2000); // 2 सेकंड बाद वापस सामान्य हो जाए
};


// --- क्लियर बटन ---
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    calculateStats();
    textInput.focus(); // टेक्स्ट एरिया पर फोकस करें
});


// --- कॉपी बटन (स्मार्ट लॉजिक के साथ) ---
copyBtn.addEventListener('click', () => {
    const textToCopy = textInput.value;
    if (!textToCopy) return; // अगर कुछ टेक्स्ट नहीं है, तो कुछ न करें

    // पहले नया, सुरक्षित तरीका आजमाएं
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error("Modern copy failed: ", err);
            alert("Could not copy text.");
        });
    } else {
        // अगर नया तरीका काम नहीं करता है तो पुराना, फॉलबैक तरीका इस्तेमाल करें
        textInput.select(); // टेक्स्ट को सेलेक्ट करें
        try {
            document.execCommand('copy'); // कॉपी करने की कोशिश करें
            showCopyFeedback();
        } catch (err) {
            console.error("Fallback copy failed: ", err);
            alert("Could not copy text.");
        }
        // टेक्स्ट से सिलेक्शन हटाएं
        window.getSelection().removeAllRanges();
    }
});


    // 5. मुख्य इवेंट लिस्नर: जब भी यूजर कुछ लिखेगा, यह चलेगा
    textInput.addEventListener('input', calculateStats);

});