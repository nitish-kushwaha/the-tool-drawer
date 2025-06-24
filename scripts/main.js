document.addEventListener('DOMContentLoaded', () => {

    // --- थीम स्विच लॉजिक ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // पेज लोड होने पर सही थीम लगाएं
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggle.checked = true;
        }
    }

    // टॉगल बटन क्लिक होने पर थीम बदलें
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light'); // यूजर की पसंद को सेव करें
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // यूजर की पसंद को सेव करें
        }
    });


    // --- बैक-टू-टॉप बटन लॉजिक ---
    const backToTopButton = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // 300px स्क्रॉल करने के बाद बटन दिखाएं
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

});