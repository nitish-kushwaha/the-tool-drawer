document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const ageForm = document.getElementById('age-form');
    const dobInput = document.getElementById('dob-input');
    
    // पॉपअप (मॉडल) के एलिमेंट्स
    const modal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // रिजल्ट दिखाने वाले एलिमेंट्स
    const resultNameEl = document.getElementById('result-name');
    const resultDobEl = document.getElementById('result-dob');
    const resultYearsEl = document.getElementById('result-years');
    const resultMonthsEl = document.getElementById('result-months');
    const resultDaysEl = document.getElementById('result-days');
    const resultHoursEl = document.getElementById('result-hours');
    const resultMinutesEl = document.getElementById('result-minutes');
    const resultSecondsEl = document.getElementById('result-seconds');
    
    // डाउनलोड बटन
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    
    let currentResultData = {}; // रिजल्ट को स्टोर करने के लिए

    // 2. पॉपअप को दिखाने और छिपाने वाले फंक्शन्स
    const showModal = () => modal.classList.add('active');
    const hideModal = () => modal.classList.remove('active');

    // 3. उम्र की गणना करने वाला मुख्य फंक्शन
    const calculateAge = (dob) => {
        const now = new Date();
        const birthDate = new Date(dob);

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // घंटे, मिनट, सेकंड की गणना
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();
        if(seconds < 0) { minutes--; seconds += 60; }
        if(minutes < 0) { hours--; minutes += 60; }
        if(hours < 0) { days--; hours += 24; }


        return { years, months, days, hours, minutes, seconds };
    };

    // 4. फॉर्म सबमिट होने पर चलने वाला इवेंट
    ageForm.addEventListener('submit', (e) => {
        e.preventDefault(); // पेज को रीलोड होने से रोकना

        const name = document.getElementById('user-name').value;
        const dobValue = dobInput.value;

        if (!dobValue) {
            alert('Please enter your date of birth.');
            return;
        }

        const dob = new Date(dobValue);
        const age = calculateAge(dob);

        // रिजल्ट को पॉपअप में दिखाना
        resultNameEl.textContent = name || 'User';
        resultDobEl.textContent = dob.toLocaleDateString('en-GB');
        resultYearsEl.textContent = age.years;
        resultMonthsEl.textContent = age.months;
        resultDaysEl.textContent = age.days;
        resultHoursEl.textContent = age.hours;
        resultMinutesEl.textContent = age.minutes;
        resultSecondsEl.textContent = age.seconds;

        // रिजल्ट को PDF डाउनलोड के लिए स्टोर करना
        currentResultData = { name: name || 'User', dob: dob.toLocaleDateString('en-GB'), ...age };

        showModal();
    });

    // 5. पॉपअप बंद करने वाले इवेंट्स
    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // सिर्फ बाहरी काली स्क्रीन पर क्लिक होने पर बंद करें
            hideModal();
        }
    });

    // 6. PDF डाउनलोड का लॉजिक
    downloadPdfBtn.addEventListener('click', () => {
        // jsPDF लाइब्रेरी का उपयोग करना जो हमने HTML में जोड़ी थी
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // PDF में कंटेंट लिखना
        doc.setFontSize(22);
        doc.text("Age Calculation Result", 105, 20, null, null, "center");
        
        doc.setFontSize(14);
        doc.text(`Name: ${currentResultData.name}`, 20, 40);
        doc.text(`Date of Birth: ${currentResultData.dob}`, 20, 50);

        doc.setFontSize(16);
        doc.text("Calculated Age:", 20, 70);
        
        doc.setFontSize(12);
        doc.text(`- ${currentResultData.years} Years`, 30, 80);
        doc.text(`- ${currentResultData.months} Months`, 30, 90);
        doc.text(`- ${currentResultData.days} Days`, 30, 100);
        doc.text(`- ${currentResultData.hours} Hours`, 30, 110);
        doc.text(`- ${currentResultData.minutes} Minutes`, 30, 120);
        doc.text(`- ${currentResultData.seconds} Seconds`, 30, 130);
        
        // PDF फाइल को सेव करना
        doc.save(`${currentResultData.name}-age-result.pdf`);
    });
});