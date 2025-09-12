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
        return this.t(`baits.${id}.name`) || baits.find(b => b.id === id)?.name || this.t('unknown');
    }

    getBaitDescription(id) {
        return this.t(`baits.${id}.description`) || baits.find(b => b.id === id)?.description || '';
    }

    getLocationName(id) {
        return this.t(`locations.${id}.name`) || fishingLocations.find(l => l.id === id)?.name || this.t('unknown');
    }

    getLocationArea(id) {
        return this.t(`locations.${id}.location`) || fishingLocations.find(l => l.id === id)?.location || '';
    }

    getFishName(id) {
        return this.t(`fish.${id}.name`) || fish.find(f => f.id === id)?.name || this.t('unknown');
    }

    getFishDescription(id) {
        return this.t(`fish.${id}.description`) || fish.find(f => f.id === id)?.description || '';
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