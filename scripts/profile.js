document.addEventListener('DOMContentLoaded', () => {
    // 1. URL से 'data' पैरामीटर को पढ़ना
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) {
        document.body.innerHTML = '<h1>No profile data found.</h1>';
        return;
    }

    try {
        // 2. डाटा को डीकोड और पार्स करना
        const jsonString = atob(encodedData); // Base64 से डीकोड करना
        const profileData = JSON.parse(jsonString); // JSON से ऑब्जेक्ट बनाना

        // 3. HTML एलिमेंट्स में डाटा को भरना
        document.getElementById('display-name').textContent = profileData.name || 'Name not provided';
        document.getElementById('display-headline').textContent = profileData.headline || '';
        
        const emailLink = document.getElementById('contact-email');
        if (profileData.email) {
            emailLink.href = `mailto:${profileData.email}`;
        } else {
            emailLink.style.display = 'none';
        }

        const phoneLink = document.getElementById('contact-phone');
        if (profileData.phone) {
            phoneLink.href = `tel:${profileData.phone}`;
        } else {
            phoneLink.style.display = 'none';
}

        const addressSection = document.getElementById('address-section');
        if (profileData.address) {
            document.getElementById('display-address').textContent = profileData.address;
        } else {
            addressSection.style.display = 'none';
        }
        
        // 4. सोशल मीडिया लिंक्स को डायनामिक रूप से बनाना
        const socialsContainer = document.getElementById('socials-container');
        const socialPlatforms = {
            linkedin: { icon: 'fa-linkedin', url: 'https://www.linkedin.com/in/' },
            twitter: { icon: 'fa-twitter', url: 'https://twitter.com/' },
            github: { icon: 'fa-github', url: 'https://github.com/' },
            instagram: { icon: 'fa-instagram', url: 'https://www.instagram.com/' }
        };

        for (const platform in socialPlatforms) {
            if (profileData[platform]) {
                const link = document.createElement('a');
                link.href = socialPlatforms[platform].url + profileData[platform];
                link.target = '_blank'; // नए टैब में खोलें
                link.classList.add('social-link');
                link.innerHTML = `<i class="fa-brands ${socialPlatforms[platform].icon}"></i>`;
                socialsContainer.appendChild(link);
            }
        }

    } catch (error) {
        console.error("Failed to decode or parse profile data:", error);
        document.body.innerHTML = '<h1>Invalid or corrupt profile data.</h1>';
    }
});