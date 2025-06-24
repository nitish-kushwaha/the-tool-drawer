document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const textInput = document.getElementById('tts-text-input');
    const maleVoicesContainer = document.getElementById('male-voices');
    const femaleVoicesContainer = document.getElementById('female-voices');
    const rateSlider = document.getElementById('rate-slider');
    const pitchSlider = document.getElementById('pitch-slider');
    const speakBtn = document.getElementById('speak-btn');
    const audioPlayer = document.getElementById('audio-player');
    const ttsStatus = document.getElementById('tts-status');

    let availableVoices = [];
    let selectedVoiceName = '';

    // 2. ब्राउज़र से उपलब्ध आवाज़ों की लिस्ट लोड करना
    const populateVoiceList = () => {
        // अगर आवाज़ें पहले से लोड हो चुकी हैं, तो दोबारा न करें
        if (availableVoices.length > 0) return;

        availableVoices = speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
        
        const maleGrid = maleVoicesContainer.querySelector('.voice-profile-grid');
        const femaleGrid = femaleVoicesContainer.querySelector('.voice-profile-grid');
        
        if (!maleGrid || !femaleGrid) return; // अगर HTML एलिमेंट मौजूद नहीं है

        maleGrid.innerHTML = ''; // पुराना कंटेंट साफ़ करें
        femaleGrid.innerHTML = ''; // पुराना कंटेंट साफ़ करें

        availableVoices.forEach(voice => {
            const button = document.createElement('button');
            button.className = 'voice-profile';
            button.dataset.voiceName = voice.name;
            
            // जेंडर के हिसाब से आइकॉन और कंटेनर चुनना
            const iconClass = 'fa-solid fa-user';
            let container = voice.name.toLowerCase().includes('male') ? maleGrid : femaleGrid;
            
            button.innerHTML = `<i class="${iconClass}"></i><span>${voice.name.split(' ')[0]}</span>`;
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.voice-profile').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedVoiceName = voice.name;
            });
            container.appendChild(button);
        });

        // डिफ़ॉल्ट रूप से पहली आवाज़ को चुनना
        const firstVoiceButton = maleGrid.children[0] || femaleGrid.children[0];
        if (firstVoiceButton) {
            firstVoiceButton.click();
        }
    };

    // आवाज़ें लोड होने में समय लग सकता है, इसलिए इवेंट का इंतज़ार करें
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    populateVoiceList(); // तुरंत चलाने की कोशिश करें


    // 3. मुख्य "Convert to Speech" बटन का लॉजिक
    speakBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text.');
            return;
        }
        if (!selectedVoiceName) {
            alert('Please select a voice first. It might still be loading.');
            return;
        }

        ttsStatus.innerHTML = '<i class="fa-solid fa-spinner"></i> Generating audio...';
        ttsStatus.classList.add('loading');
        audioPlayer.style.display = 'none';

        try {
            const rate = parseFloat(rateSlider.value);
            const pitchValue = parseFloat(pitchSlider.value);
            const pitch = (pitchValue - 1) * 20;

            const response = await fetch('/.netlify/functions/text-to-speech', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    voiceName: selectedVoiceName,
                    speakingRate: rate,
                    pitch: pitch
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate audio: ${errorText}`);
            }

            const data = await response.json();
            if (!data.audioContent) {
                throw new Error("Received empty audio content from server.");
            }
            
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            
            audioPlayer.src = audioSrc;
            audioPlayer.style.display = 'block';
            audioPlayer.play();

            ttsStatus.textContent = 'Audio ready! Playing...';
            ttsStatus.classList.remove('loading');

        } catch (error) {
            console.error('Error:', error);
            ttsStatus.textContent = 'Error! Could not generate audio.';
            ttsStatus.classList.remove('loading');
        }
    });
});