document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    // =================================================================
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateBtns = document.querySelectorAll('.generate-qr-btn');
    const dotsColorInput = document.getElementById('dots-color-input');
    const downloadPngBtn = document.getElementById('download-png-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const qrCodeContainer = document.getElementById('qrcode-preview');

    // =================================================================
    // 2. QR Code Styling लाइब्रेरी को इनिशियलाइज़ करना
    // =================================================================
    const qrCode = new QRCodeStyling({
        width: 256,
        height: 256,
        data: "https://thetooldrawer.com", // डिफ़ॉल्ट डेटा
        image: "",
        dotsOptions: {
            color: "#000000",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10
        },
        cornersSquareOptions: {
            type: "extra-rounded"
        },
        cornersDotOptions: {
            type: "dot"
        }
    });

    // QR कोड को हमारे HTML एलिमेंट में जोड़ना
    qrCode.append(qrCodeContainer);

    // पहली बार QR कोड बनाने के बाद डाउनलोड बटन दिखाना
    downloadPngBtn.style.display = 'block';
    downloadSvgBtn.style.display = 'block';

    // =================================================================
    // 3. टैब स्विचिंग का लॉजिक
    // =================================================================
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('disabled')) return; // डिसेबल टैब पर कुछ न करें

            // सभी टैब्स और कंटेंट से 'active' क्लास हटाना
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // क्लिक किए गए टैब और उसके कंटेंट पर 'active' क्लास लगाना
            tab.classList.add('active');
            const targetContent = document.getElementById(`form-${tab.dataset.tab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });



    // डेट को iCalendar फॉर्मेट में बदलने के लिए हेल्पर फंक्शन
    const formatICalDate = (isoString) => {
        if (!isoString) return '';
        // YYYY-MM-DDTHH:MM से YYYYMMDDTHHMMSSZ बनाना
        return isoString.replace(/[-:]/g, '') + '00Z';
    };

    // =================================================================
    // 4. QR कोड बनाने का मुख्य लॉजिक
    // =================================================================
    const generateCurrentQrCode = () => {
        const activeTab = document.querySelector('.tab-link.active').dataset.tab;
        let dataToEncode = '';

        switch (activeTab) {
            case 'url':
                dataToEncode = document.getElementById('qr-url-input').value;
                break;
            case 'text':
                dataToEncode = document.getElementById('qr-text-input').value;
                break;
            case 'email':
                const emailTo = document.getElementById('email-to').value;
                const subject = document.getElementById('email-subject').value;
                const body = document.getElementById('email-body').value;
                dataToEncode = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                break;
            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value;
                const password = document.getElementById('wifi-password').value;
                const encryption = document.getElementById('wifi-encryption').value;
                dataToEncode = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
                break;
            case 'vcard':
                const vcardFirstName = document.getElementById('vcard-firstname').value;
                const vcardLastName = document.getElementById('vcard-lastname').value;
                const vcardPhone = document.getElementById('vcard-phone').value; // नया यूनिक नाम
                const vcardEmail = document.getElementById('vcard-email').value;
                dataToEncode = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName};${vcardFirstName}\nFN:${vcardFirstName} ${vcardLastName}\nTEL;TYPE=CELL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
                break;
            case 'whatsapp':
                const whatsappPhone = document.getElementById('whatsapp-phone').value; // नया यूनिक नाम
                const whatsappMessage = document.getElementById('whatsapp-message').value;
                dataToEncode = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;
                break;
            case 'sms':
                const smsPhone = document.getElementById('sms-phone').value;
                const smsMessage = document.getElementById('sms-message').value;
                dataToEncode = `SMSTO:${smsPhone}:${smsMessage}`;
                break;

            case 'phone':
                const phoneNumber = document.getElementById('phone-number').value;
                dataToEncode = `tel:${phoneNumber}`;
                break;

            case 'event':
                const summary = document.getElementById('event-summary').value;
                const location = document.getElementById('event-location').value;
                const dtstart = formatICalDate(document.getElementById('event-dtstart').value);
                const dtend = formatICalDate(document.getElementById('event-dtend').value);
                const description = document.getElementById('event-description').value;

                dataToEncode = `BEGIN:VEVENT\nSUMMARY:${summary}\nLOCATION:${location}\nDTSTART:${dtstart}\nDTEND:${dtend}\nDESCRIPTION:${description}\nEND:VEVENT`;
                break;

            case 'social':
                const platform = document.getElementById('social-platform').value;
                const username = document.getElementById('social-username').value;
                const baseUrls = {
                    twitter: 'https://twitter.com/',
                    instagram: 'https://www.instagram.com/',
                    linkedin: 'https://www.linkedin.com/in/',
                    facebook: 'https://www.facebook.com/',
                    youtube: 'https://www.youtube.com/@'
                };
                dataToEncode = `${baseUrls[platform]}${username}`;
                break;

            case 'profile':
                // 1. एक ऑब्जेक्ट में सारा डाटा इकट्ठा करना
                const profileData = {
                    name: document.getElementById('profile-name').value,
                    headline: document.getElementById('profile-headline').value,
                    email: document.getElementById('profile-email').value,
                    phone: document.getElementById('profile-phone').value,
                    address: document.getElementById('profile-address').value,
                    linkedin: document.getElementById('social-linkedin').value,
                    twitter: document.getElementById('social-twitter').value,
                    github: document.getElementById('social-github').value,
                    instagram: document.getElementById('social-instagram').value,
                };

                // 2. ऑब्जेक्ट को JSON स्ट्रिंग में बदलना
                const jsonString = JSON.stringify(profileData);

                // 3. JSON स्ट्रिंग को Base64 में एन्कोड करना
                const encodedData = btoa(jsonString);

                // 4. पूरा और एब्सोल्यूट URL बनाना (यह मुख्य बदलाव है)
                const baseUrl = window.location.origin; // यह 'http://127.0.0.1:5500' जैसा कुछ देगा
                const profileUrl = `${baseUrl}/profile.html?data=${encodedData}`;

                dataToEncode = profileUrl;
                break;


        }

        if (!dataToEncode.trim()) {
            // अगर इनपुट खाली है तो कुछ न करें या एरर दिखाएं
            return;
        }

        // QR कोड को नए डेटा के साथ अपडेट करना
        qrCode.update({
            data: dataToEncode
        });
    };

    // सभी जेनरेट बटनों पर इवेंट लिस्नर लगाना
    generateBtns.forEach(btn => {
        btn.addEventListener('click', generateCurrentQrCode);
    });

    // =================================================================
    // 5. कस्टमाइजेशन का लॉजिक
    // =================================================================
    // डॉट्स का रंग बदलने पर
    dotsColorInput.addEventListener('input', (e) => {
        qrCode.update({
            dotsOptions: {
                color: e.target.value
            }
        });
    });

    // =================================================================
    // 6. डाउनलोड का लॉजिक
    // =================================================================
    downloadPngBtn.addEventListener('click', () => {
        qrCode.download({ name: "qrcode", extension: "png" });
    });

    downloadSvgBtn.addEventListener('click', () => {
        qrCode.download({ name: "qrcode", extension: "svg" });
    });


    // सोशल मीडिया प्लेटफॉर्म बदलने पर URL प्रीफिक्स अपडेट करना
    const socialPlatformSelect = document.getElementById('social-platform');
    const socialUrlPrefix = document.getElementById('social-url-prefix');
    const baseUrlsForPrefix = {
        twitter: 'https://twitter.com/',
        instagram: 'https://www.instagram.com/',
        linkedin: 'https://www.linkedin.com/in/',
        facebook: 'https://www.facebook.com/',
        youtube: 'https://www.youtube.com/@'
    };

    socialPlatformSelect.addEventListener('change', (e) => {
        socialUrlPrefix.textContent = baseUrlsForPrefix[e.target.value];
    });



    // पेज लोड होने पर एक डिफ़ॉल्ट QR कोड बनाना
    generateCurrentQrCode();

});