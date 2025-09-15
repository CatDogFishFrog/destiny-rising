class I18n {
    constructor() {
        this.currentLang = 'en';
        this.fallbackLang = 'en';
        this.translations = {};
        this.detectLanguage();
    }

    detectLanguage() {
        const saved = localStorage.getItem('destiny-fishing-lang');
        if (saved) {
            this.currentLang = saved;
            return;
        }

        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('uk')) {
            this.currentLang = 'uk';
        } else {
            this.currentLang = 'en';
        }
    }

    setLanguage(lang) {
        if (lang && (lang === 'en' || lang === 'uk')) {
            this.currentLang = lang;
            localStorage.setItem('destiny-fishing-lang', lang);
            document.documentElement.setAttribute('lang', lang);
            this.updateUI();
        }
    }

    t(key, data = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        let fallback = this.translations[this.fallbackLang];

        for (const k of keys) {
            value = value?.[k];
            fallback = fallback?.[k];
        }

        const result = value || fallback || key;
        
        // Replace placeholders
        return Object.keys(data).reduce((str, placeholder) => {
            return str.replace(`{${placeholder}}`, data[placeholder]);
        }, result);
    }

    getBaitName(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.baits?.[id]?.name;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.baits?.[id]?.name;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = baits.find(b => b.id === id)?.name;
        if (rawData) return rawData;
        
        return this.t('unknown');
    }

    getBaitDescription(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.baits?.[id]?.description;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.baits?.[id]?.description;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = baits.find(b => b.id === id)?.description;
        return rawData || '';
    }

    getLocationName(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.locations?.[id]?.name;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.locations?.[id]?.name;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = fishingLocations.find(l => l.id === id)?.name;
        if (rawData) return rawData;
        
        return this.t('unknown');
    }

    getLocationArea(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.locations?.[id]?.location;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.locations?.[id]?.location;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = fishingLocations.find(l => l.id === id)?.location;
        return rawData || '';
    }

    getFishName(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.fish?.[id]?.name;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.fish?.[id]?.name;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = fish.find(f => f.id === id)?.name;
        if (rawData) return rawData;
        
        return this.t('unknown');
    }

    getFishDescription(id) {
        // 1. Поточна локалізація
        const currentLang = this.translations[this.currentLang]?.fish?.[id]?.description;
        if (currentLang) return currentLang;
        
        // 2. Англійська локалізація
        const englishLang = this.translations[this.fallbackLang]?.fish?.[id]?.description;
        if (englishLang) return englishLang;
        
        // 3. Сирі дані
        const rawData = fish.find(f => f.id === id)?.description;
        return rawData || '';
    }

    updateUI() {
        // Update title
        document.title = this.t('title');
        document.querySelector('h1').textContent = this.t('title');

        // Update buttons
        document.getElementById('beauty-mode').textContent = this.t('beauty');
        document.getElementById('performance-mode').textContent = this.t('performance');

        // Update sorting
        document.querySelector('.sort-left label').textContent = this.t('sorting');
        document.querySelector('[data-sort="name"]').textContent = this.t('sortByName');
        document.querySelector('[data-sort="rarity"]').textContent = this.t('sortByRarity');
        document.querySelector('[data-sort="price"]').textContent = this.t('sortByPrice');

        // Update filter labels
        document.querySelectorAll('.filter-group label')[0].textContent = this.t('bait');
        document.querySelectorAll('.filter-group label')[1].textContent = this.t('location');
        document.querySelectorAll('.filter-group label')[2].textContent = this.t('rarity');

        // Update tooltip
        document.getElementById('performance-tooltip').textContent = this.t('beautyModeWarning');

        // Update language selector
        this.updateLanguageSelector();

        // Refresh filters and fish display
        if (typeof initializeFilters === 'function') {
            initializeFilters();
            displayFish();
        }
    }

    updateLanguageSelector() {
        // Використовуємо функцію з app.js
        if (typeof updateLanguageSelector === 'function') {
            updateLanguageSelector();
        }
    }

    loadTranslations() {
        if (typeof locales_en !== 'undefined') {
            this.translations.en = locales_en;
        }
        if (typeof locales_uk !== 'undefined') {
            this.translations.uk = locales_uk;
        }
    }
}

const i18n = new I18n();