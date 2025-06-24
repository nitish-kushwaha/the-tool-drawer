document.addEventListener('DOMContentLoaded', () => {

    // (ऊपर का सारा कोड वैसा ही रहेगा...)
    const passwordDisplay = document.getElementById('password-display');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const generateBtn = document.getElementById('generate-btn');
    const uppercaseCheck = document.getElementById('include-uppercase');
    const lowercaseCheck = document.getElementById('include-lowercase');
    const numbersCheck = document.getElementById('include-numbers');
    const symbolsCheck = document.getElementById('include-symbols');
    const strengthIndicator = document.querySelector('.strength-indicator');
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?'
    };
    const updateSliderBackground = () => {
        const value = (lengthSlider.value - lengthSlider.min) / (lengthSlider.max - lengthSlider.min) * 100;
        lengthSlider.style.setProperty('--value', `${value}%`);
    };
    const updatePasswordStrength = (length, optionCount) => {
        let strength = 0;
        if (length >= 8) strength++;
        if (length >= 12) strength++;
        if (optionCount >= 3) strength++;
        if (optionCount >= 4) strength++;
        if (length >= 16) strength++;
        strengthIndicator.className = 'strength-indicator';
        if (strength <= 1) strengthIndicator.classList.add('weak');
        else if (strength === 2) strengthIndicator.classList.add('medium');
        else if (strength <= 4) strengthIndicator.classList.add('strong');
        else strengthIndicator.classList.add('verystrong');
    };
    const generatePassword = () => {
        const length = lengthSlider.value;
        let allowedChars = '';
        let password = '';
        let guaranteedChars = [];
        if (uppercaseCheck.checked) {
            allowedChars += charSets.uppercase;
            guaranteedChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
        }
        if (lowercaseCheck.checked) {
            allowedChars += charSets.lowercase;
            guaranteedChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
        }
        if (numbersCheck.checked) {
            allowedChars += charSets.numbers;
            guaranteedChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
        }
        if (symbolsCheck.checked) {
            allowedChars += charSets.symbols;
            guaranteedChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
        }
        if (allowedChars === '') {
            passwordDisplay.textContent = 'Select options';
            passwordDisplay.classList.remove('generated');
            updatePasswordStrength(0, 0);
            return;
        }
        for (let i = guaranteedChars.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allowedChars.length);
            password += allowedChars[randomIndex];
        }
        password = guaranteedChars.join('') + password;
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        passwordDisplay.textContent = password;
        passwordDisplay.classList.add('generated');
        updatePasswordStrength(password.length, guaranteedChars.length);
    };

// --- कॉपी बटन का फाइनल और क्लीन लॉजिक ---
copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.textContent;
    // सुनिश्चित करें कि पासवर्ड खाली या प्लेसहोल्डर न हो
    if (!password || passwordDisplay.classList.contains('password-placeholder')) {
        return; 
    }

    // यह नया तरीका अब Live Server पर 100% काम करेगा
    navigator.clipboard.writeText(password).then(() => {
        // कॉपी होने पर यूजर को फीडबैक देना
        const icon = copyBtn.querySelector('i');
        const tooltip = copyBtn.querySelector('.tooltip');
        icon.classList.remove('fa-regular', 'fa-copy');
        icon.classList.add('fa-solid', 'fa-check');
        tooltip.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            icon.classList.remove('fa-solid', 'fa-check');
            icon.classList.add('fa-regular', 'fa-copy');
            tooltip.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000); // 2 सेकंड बाद वापस सामान्य हो जाए

    }).catch(err => {
        console.error("Copy failed: ", err);
        alert("Sorry, copy failed. Please try again.");
    });
});
    
    // बाकी इवेंट लिस्नर्स
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
        updateSliderBackground();
        generatePassword();
    });
    [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(c => c.addEventListener('change', generatePassword));
    generateBtn.addEventListener('click', generatePassword);
    regenerateBtn.addEventListener('click', generatePassword);
    
    updateSliderBackground();
    generatePassword();
});