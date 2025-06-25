document.addEventListener('DOMContentLoaded', () => {

    // 1. सभी यूनिट्स और उनके कन्वर्जन फैक्टर्स का डेटाबेस
    // इस पूरे units ऑब्जेक्ट को नए वाले से बदल दें
const units = {
    length: {
        'Meter (m)': 1,
        'Kilometer (km)': 1000,
        'Centimeter (cm)': 0.01,
        'Millimeter (mm)': 0.001,
        'Mile (mi)': 1609.34,
        'Yard (yd)': 0.9144,
        'Foot (ft)': 0.3048,
        'Inch (in)': 0.0254,
    },
    area: {
        'Square Meter (m²)': 1,
        'Square Kilometer (km²)': 1000000,
        'Hectare (ha)': 10000,
        'Acre (ac)': 4046.86,
        'Square Foot (ft²)': 0.092903,
        'Square Inch (in²)': 0.00064516,
    },
    volume: {
        'Liter (L)': 1,
        'Milliliter (mL)': 0.001,
        'Cubic Meter (m³)': 1000,
        'Gallon (US)': 3.78541,
        'Pint (US)': 0.473176,
    },
    weight: {
        'Kilogram (kg)': 1,
        'Gram (g)': 0.001,
        'Milligram (mg)': 0.000001,
        'Tonne (t)': 1000,
        'Pound (lb)': 0.453592,
        'Ounce (oz)': 0.0283495,
    },
    temperature: {
        'Celsius (°C)': { toBase: c => c, fromBase: c => c },
        'Fahrenheit (°F)': { toBase: f => (f - 32) * 5 / 9, fromBase: c => (c * 9 / 5) + 32 },
        'Kelvin (K)': { toBase: k => k - 273.15, fromBase: c => c + 273.15 }
    },
    speed: {
        'Meters/sec (m/s)': 1,
        'Kilometers/hr (km/h)': 0.277778,
        'Miles/hr (mph)': 0.44704,
        'Knot': 0.514444,
    },
    time: {
        'Second (s)': 1,
        'Millisecond (ms)': 0.001,
        'Minute (min)': 60,
        'Hour (hr)': 3600,
        'Day': 86400,
        'Week': 604800,
    },
    pressure: {
        'Pascal (Pa)': 1,
        'Kilopascal (kPa)': 1000,
        'Bar': 100000,
        'PSI': 6894.76,
        'Atmosphere (atm)': 101325,
    },
    energy: {
        'Joule (J)': 1,
        'Kilojoule (kJ)': 1000,
        'Calorie (cal)': 4.184,
        'Kilocalorie (kcal)': 4184,
        'Watt Hour (Wh)': 3600,
    },
    frequency: {
        'Hertz (Hz)': 1,
        'Kilohertz (kHz)': 1000,
        'Megahertz (MHz)': 1000000,
        'Gigahertz (GHz)': 1000000000,
    },
    digital_storage: {
        'Byte (B)': 1,
        'Kilobyte (KB)': 1000,
        'Megabyte (MB)': 1000000,
        'Gigabyte (GB)': 1000000000,
        'Terabyte (TB)': 1000000000000,
    },
    data_transfer_rate: {
        'Bits/sec (bps)': 1,
        'Kilobits/sec (kbps)': 1000,
        'Megabits/sec (mbps)': 1000000,
        'Gigabits/sec (gbps)': 1000000000,
    },
    fuel_economy: { // Note: Higher value is better
        'Kilometer/Liter (km/L)': 1,
        'Miles/Gallon (US)': 0.425144,
    },
    plane_angle: {
        'Degree (°)': 1,
        'Radian (rad)': 57.2958,
        'Gradian (grad)': 0.9,
    }
};
    // 2. सभी ज़रूरी HTML एलिमेंट्स को चुनना
    const categorySelect = document.getElementById('category-select');
    const fromUnitSelect = document.getElementById('from-unit-select');
    const toUnitSelect = document.getElementById('to-unit-select');
    const inputValue = document.getElementById('input-value');
    const outputValue = document.getElementById('output-value');
    const swapBtn = document.getElementById('swap-btn');
    const resultText = document.getElementById('result-text');

    // 3. यूनिट ड्रॉपडाउन को भरने वाला फंक्शन
    const populateUnits = () => {
        const category = categorySelect.value;
        const currentUnits = Object.keys(units[category]);

        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        currentUnits.forEach(unit => {
            fromUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        });

        // डिफ़ॉल्ट वैल्यू सेट करना
        fromUnitSelect.value = currentUnits[0];
        toUnitSelect.value = currentUnits[1];
    };

    // 4. मुख्य गणना करने वाला फंक्शन
    const convert = () => {
        const category = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const value = parseFloat(inputValue.value);

        if (isNaN(value)) {
            outputValue.value = '';
            resultText.innerHTML = '';
            return;
        }

        let result;

        if (category === 'temperature') {
            const toBase = units[category][fromUnit].toBase;
            const fromBase = units[category][toUnit].fromBase;
            const baseValue = toBase(value);
            result = fromBase(baseValue);
        } else {
            const fromFactor = units[category][fromUnit];
            const toFactor = units[category][toUnit];
            const baseValue = value * fromFactor; // पहले बेस यूनिट में बदलना (जैसे मीटर)
            result = baseValue / toFactor; // फिर टारगेट यूनिट में बदलना
        }

        outputValue.value = result.toFixed(5).replace(/\.?0+$/, ""); // अनावश्यक शून्य हटाना

        // रिजल्ट टेक्स्ट को अपडेट करना
        resultText.innerHTML = `${value} <strong>${fromUnit}</strong> = ${outputValue.value} <strong>${toUnit}</strong>`;
    };

    // 5. सभी बटनों और इनपुट्स पर इवेंट लिस्नर लगाना
    categorySelect.addEventListener('change', () => {
        populateUnits();
        convert();
    });

    inputValue.addEventListener('input', convert);
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);

    swapBtn.addEventListener('click', () => {
        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;
        convert();
    });

    // 6. पेज लोड होने पर पहली बार चलाना
    populateUnits();
    convert();

});