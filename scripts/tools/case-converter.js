document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const outputWordsEl = document.getElementById('output-words');
    const outputCharsEl = document.getElementById('output-chars');

    // केस बदलने वाले बटन्स
    const btnSentenceCase = document.getElementById('btn-sentence-case');
    const btnLowerCase = document.getElementById('btn-lower-case');
    const btnUpperCase = document.getElementById('btn-upper-case');
    const btnCapitalizedCase = document.getElementById('btn-capitalized-case');
    const btnAlternatingCase = document.getElementById('btn-alternating-case');
    const btnTitleCase = document.getElementById('btn-title-case');
    const btnInverseCase = document.getElementById('btn-inverse-case');

    // यूटिलिटी बटन्स
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');
    const btnClear = document.getElementById('btn-clear');
    
    // 2. मुख्य फंक्शन जो सभी काम करेगा
    const performConversion = (conversionType) => {
        const text = inputText.value;
        let result = '';

        switch(conversionType) {
            case 'sentence':
                result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'capitalized':
                result = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                break;
            case 'alternating':
                result = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
            case 'title':
                 // यह Capitalized Case का एक बेहतर संस्करण है
                result = text.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
                break;
            case 'inverse':
                result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
        }

        outputText.value = result;
        updateOutputStats();
    };

    // 3. आउटपुट स्टैट्स (वर्ड काउंटर) को अपडेट करने का फंक्शन
    const updateOutputStats = () => {
        const text = outputText.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        
        outputWordsEl.textContent = words.length;
        outputCharsEl.textContent = text.length;
    };

    // 4. सभी बटनों पर इवेंट लिस्नर लगाना
    btnSentenceCase.addEventListener('click', () => performConversion('sentence'));
    btnLowerCase.addEventListener('click', () => performConversion('lower'));
    btnUpperCase.addEventListener('click', () => performConversion('upper'));
    btnCapitalizedCase.addEventListener('click', () => performConversion('capitalized'));
    btnAlternatingCase.addEventListener('click', () => performConversion('alternating'));
    btnTitleCase.addEventListener('click', () => performConversion('title'));
    btnInverseCase.addEventListener('click', () => performConversion('inverse'));

    // यूटिलिटी बटन्स का लॉजिक
    btnClear.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        updateOutputStats();
    });

    btnCopy.addEventListener('click', () => {
        if (outputText.value) {
            navigator.clipboard.writeText(outputText.value).then(() => {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = 'Copied!';
                setTimeout(() => { btnCopy.innerHTML = originalText; }, 2000);
            });
        }
    });
    
    btnDownload.addEventListener('click', () => {
        if (outputText.value) {
            const blob = new Blob([outputText.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted-text.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });

    // जब इनपुट बॉक्स में कुछ टाइप हो तो आउटपुट को क्लियर करना
    inputText.addEventListener('input', () => {
        outputText.value = '';
        updateOutputStats();
    });
});