document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const uploadSection = document.getElementById('upload-section');
    const editorArea = document.getElementById('editor-area');
    const imageInput = document.getElementById('image-input');
    const sourceImage = document.getElementById('source-image');
    const dropZone = document.querySelector('.drop-zone');

    // कंट्रोल और ऑप्शन एलिमेंट्स
    const ratioButtonsContainer = document.querySelector('.preset-ratios');
    const outputWidthInput = document.getElementById('output-width');
    const outputHeightInput = document.getElementById('output-height');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    
    // टूलबार और एक्शन बटन्स
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const cropDownloadBtn = document.getElementById('crop-download-btn');
    const uploadNewBtn = document.getElementById('upload-new-btn');

    let cropper = null;

    // 2. फाइल हैंडल करने और Cropper को शुरू करने का फंक्शन
    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImage.src = e.target.result;
            uploadSection.style.display = 'none';
            editorArea.style.display = 'grid';

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(sourceImage, {
                aspectRatio: 1, // डिफ़ॉल्ट 1:1 (स्क्वायर)
                viewMode: 1,
                preview: '.preview-box',
                responsive: true,
                autoCropArea: 0.95,
                background: false,
                // क्रॉप बॉक्स बदलने पर डायमेंशन अपडेट करना
                crop(event) {
                    const { width, height } = event.detail;
                    outputWidthInput.value = Math.round(width);
                    outputHeightInput.value = Math.round(height);
                },
            });
        };
        reader.readAsDataURL(file);
    };

    // 3. सभी इवेंट लिस्नर्स लगाना
    imageInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    
    // ड्रैग एंड ड्रॉप
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFile(e.dataTransfer.files[0]);
    });

    // टूलबार बटन्स
    zoomInBtn.addEventListener('click', () => cropper && cropper.zoom(0.1));
    zoomOutBtn.addEventListener('click', () => cropper && cropper.zoom(-0.1));
    rotateBtn.addEventListener('click', () => cropper && cropper.rotate(45));
    resetBtn.addEventListener('click', () => cropper && cropper.reset());

    // आस्पेक्ट रेशियो बटन्स
    ratioButtonsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.ratio-btn');
        if (button && cropper) {
            // सभी बटनों से 'active' क्लास हटाना
            ratioButtonsContainer.querySelectorAll('.ratio-btn').forEach(btn => btn.classList.remove('active'));
            // क्लिक किए गए बटन पर 'active' क्लास लगाना
            button.classList.add('active');
            
            const ratio = parseFloat(button.dataset.ratio);
            cropper.setAspectRatio(ratio);
        }
    });

    // क्वालिटी स्लाइडर
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
        // स्लाइडर के प्रोग्रेस बार को अपडेट करना
        const value = (qualitySlider.value - qualitySlider.min) / (qualitySlider.max - qualitySlider.min) * 100;
        qualitySlider.style.setProperty('--value', `${value}%`);
    });

    // क्रॉप और डाउनलोड बटन
    cropDownloadBtn.addEventListener('click', () => {
        if (cropper) {
            const outputWidth = parseInt(outputWidthInput.value);
            const outputHeight = parseInt(outputHeightInput.value);
            const jpegQuality = parseInt(qualitySlider.value) / 100;

            if (!outputWidth || !outputHeight || outputWidth <= 0 || outputHeight <= 0) {
                alert("Please specify valid output dimensions.");
                return;
            }

            const croppedCanvas = cropper.getCroppedCanvas({
                width: outputWidth,
                height: outputHeight,
                imageSmoothingQuality: 'high'
            });

            const link = document.createElement('a');
            link.href = croppedCanvas.toDataURL('image/jpeg', jpegQuality);
            link.download = `tool-drawer-resized-${outputWidth}x${outputHeight}.jpg`;
            link.click();
        }
    });
    
    // नई इमेज अपलोड बटन
    uploadNewBtn.addEventListener('click', () => {
        editorArea.style.display = 'none';
        uploadSection.style.display = 'block';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        imageInput.value = '';
    });

    // पेज लोड होने पर स्लाइडर को सही से दिखाना
    updateSliderBackground();
});