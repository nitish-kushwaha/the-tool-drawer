document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('tts-text-input');
    const voiceSelectContainer = document.querySelector('.voice-profiles');
    const rateSlider = document.getElementById('rate-slider');
    const pitchSlider = document.getElementById('pitch-slider');
    const speakBtn = document.getElementById('speak-btn');
    const audioPlayer = document.getElementById('audio-player');
    const ttsStatus = document.getElementById('tts-status');

    let availableVoices = [];
    let selectedVoiceName = '';

    // ब्राउज़र से उपलब्ध आवाज़ों की लिस्ट लोड करना
    const populateVoiceList = () => {
        availableVoices = speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
        
        const maleContainer = document.getElementById('male-voices');
        const femaleContainer = document.getElementById('female-voices');
        
        maleContainer.innerHTML = '<h4>Male</h4><div class="voice-profile-grid"></div>';
        femaleContainer.innerHTML = '<h4>Female</h4><div class="voice-profile-grid"></div>';

        const maleGrid = maleContainer.querySelector('.voice-profile-grid');
        const femaleGrid = femaleContainer.querySelector('.voice-profile-grid');

        availableVoices.forEach(voice => {
            const button = document.createElement('button');
            button.className = 'voice-profile';
            button.dataset.voiceName = voice.name;
            
            let iconClass = 'fa-solid fa-user';
            let container = maleGrid;

            if (voice.gender === 'female' || voice.name.toLowerCase().includes('female')) {
                iconClass = 'fa-solid fa-user-female'; // Note: this icon might not exist, fa-user is safer
                container = femaleGrid;
            } else if (voice.name.toLowerCase().includes('male')) {
                 iconClass = 'fa-solid fa-user-male'; // Note: might not exist
                 container = maleGrid;
            }
            
            button.innerHTML = `<i class="${iconClass}"></i><span>${voice.name.split(' ')[0]}</span>`;
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.voice-profile').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedVoiceName = voice.name;
            });
            container.appendChild(button);
        });

        // डिफ़ॉल्ट रूप से पहली आवाज़ को चुनना
        if(maleGrid.children.length > 0) {
            maleGrid.children[0].click();
        } else if (femaleGrid.children.length > 0) {
            femaleGrid.children[0].click();
        }
    };

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // मुख्य "Convert to Speech" बटन का लॉजिक
    speakBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text.');
            return;
        }

        ttsStatus.innerHTML = '<i class="fa-solid fa-spinner"></i> Generating audio...';
        ttsStatus.classList.add('loading');
        audioPlayer.style.display = 'none';

        try {
            const response = await fetch('/.netlify/functions/text-to-speech', {
                method: 'POST',
                body: JSON.stringify({
                    text: text,
                    voiceName: selectedVoiceName,
                    speakingRate: rateSlider.value,
                    pitch: pitchSlider.value - 1 // Pitch is from -20 to 20, we adjust from our 0-2 slider
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio.');
            }

            const data = await response.json();
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            
            audioPlayer.src = audioSrc;
            audioPlayer.style.display = 'block';
            audioPlayer.play();

            ttsStatus.innerHTML = 'Audio ready!';
            ttsStatus.classList.remove('loading');

        } catch (error) {
            console.error('Error:', error);
            ttsStatus.textContent = 'Error! Could not generate audio.';
            ttsStatus.classList.remove('loading');
        }
    });
});