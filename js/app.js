let filteredFish = [...fish];
let currentSort = 'name';
let currentSize = 'medium';
let beautyModeShown = false;

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    i18n.loadTranslations();
    i18n.setLanguage(i18n.currentLang);
    createAnimatedBackground();
    initializeFilters();
    setupEventListeners();
    setupModeToggle();
    setupLanguageSelector();
    displayFish();
});

function setupLanguageSelector() {
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            i18n.setLanguage(option.dataset.lang);
        });
    });
}

function showBeautyModeTooltip() {
    const tooltip = document.getElementById('performance-tooltip');
    
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 500);
    
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 7500);
}

function setupModeToggle() {
    const beautyBtn = document.getElementById('beauty-mode');
    const performanceBtn = document.getElementById('performance-mode');
    
    // Режим продуктивності за замовчуванням
    performanceBtn.classList.add('active');
    
    beautyBtn.addEventListener('click', () => {
        document.body.classList.add('beauty-mode');
        beautyBtn.classList.add('active');
        performanceBtn.classList.remove('active');
        
        if (!beautyModeShown) {
            showBeautyModeTooltip();
            beautyModeShown = true;
        }
    });
    
    performanceBtn.addEventListener('click', () => {
        document.body.classList.remove('beauty-mode');
        performanceBtn.classList.add('active');
        beautyBtn.classList.remove('active');
    });
}

function createAnimatedBackground() {
    const bg = document.getElementById('animated-bg');
    
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = bubble.style.height = Math.random() * 60 + 20 + 'px';
        bubble.style.animationDelay = Math.random() * 15 + 's';
        bubble.style.animationDuration = (Math.random() * 10 + 15) + 's';
        bg.appendChild(bubble);
    }
}

function initializeFilters() {
    // Фільтри наживок
    const baitFilters = document.getElementById('bait-filters');
    baitFilters.className = 'filter-buttons';
    baitFilters.innerHTML = '';
    baits.forEach(bait => {
        const toggle = createFilterCheckbox(`bait-${bait.id}`, i18n.getBaitName(bait.id), 'bait');
        baitFilters.appendChild(toggle);
    });

    // Фільтри місць
    const locationFilters = document.getElementById('location-filters');
    locationFilters.className = 'filter-buttons';
    locationFilters.innerHTML = '';
    fishingLocations.forEach(location => {
        const toggle = createFilterCheckbox(`location-${location.id}`, i18n.getLocationName(location.id), 'location');
        locationFilters.appendChild(toggle);
    });

    // Фільтри рідкості
    const rarityFilters = document.getElementById('rarity-filters');
    rarityFilters.className = 'filter-buttons';
    rarityFilters.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const toggle = createFilterCheckbox(`rarity-${i}`, `${i}★`, 'rarity');
        rarityFilters.appendChild(toggle);
    }
}

function createFilterCheckbox(id, label, type) {
    const div = document.createElement('div');
    div.className = 'filter-toggle';
    div.innerHTML = `
        <input type="checkbox" id="${id}" data-type="${type}" data-value="${id.split('-')[1]}">
        ${label}
    `;
    
    div.addEventListener('click', () => {
        const input = div.querySelector('input');
        input.checked = !input.checked;
        div.classList.toggle('active', input.checked);
        applyFilters();
    });
    
    return div;
}

function setupEventListeners() {
    // Сортування
    document.querySelectorAll('.sort-toggle').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.sort-toggle').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSort = button.dataset.sort;
            displayFish();
        });
    });

    // Розміри карток
    document.querySelectorAll('.size-toggle').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.size-toggle').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSize = button.dataset.size;
            updateGridSize();
        });
    });

    // Фільтри обробляються в createFilterCheckbox

    // Модальне вікно
    const modal = document.getElementById('fish-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function applyFilters() {
    const baitFilters = Array.from(document.querySelectorAll('[data-type="bait"]:checked')).map(cb => parseInt(cb.dataset.value));
    const locationFilters = Array.from(document.querySelectorAll('[data-type="location"]:checked')).map(cb => parseInt(cb.dataset.value));
    const rarityFilters = Array.from(document.querySelectorAll('[data-type="rarity"]:checked')).map(cb => parseInt(cb.dataset.value));

    filteredFish = fish.filter(fishItem => {
        const baitMatch = baitFilters.length === 0 || baitFilters.includes(fishItem.favoriteBait);
        const locationMatch = locationFilters.length === 0 || fishItem.locations.some(loc => locationFilters.includes(loc));
        const rarityMatch = rarityFilters.length === 0 || rarityFilters.includes(fishItem.rarity);
        
        return baitMatch && locationMatch && rarityMatch;
    });

    displayFish();
}

function sortFish(fishArray) {
    return [...fishArray].sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rarity':
                return b.rarity - a.rarity;
            case 'price':
                return b.price - a.price;
            default:
                return 0;
        }
    });
}

function updateGridSize() {
    const container = document.getElementById('fish-grid');
    container.className = `size-${currentSize}`;
}

function displayFish() {
    const container = document.getElementById('fish-grid');
    const sortedFish = sortFish(filteredFish);
    
    container.innerHTML = sortedFish.map(fishItem => {
        const fishName = i18n.getFishName(fishItem.id);
        const baitName = i18n.getBaitName(fishItem.favoriteBait);
        const bait = baits.find(b => b.id === fishItem.favoriteBait);
        
        return `
            <div class="fish-card rarity-${fishItem.rarity}" onclick="openFishModal(${fishItem.id})">
                <img src="${fishItem.image}" alt="${fishName}" class="fish-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU2IiBoZWlnaHQ9IjE1NiIgdmlld0JveD0iMCAwIDE1NiAxNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTYiIGhlaWdodD0iMTU2IiBmaWxsPSIjMzQ0OTVlIi8+Cjx0ZXh0IHg9Ijc4IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZWNmMGYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GaXNoPC90ZXh0Pgo8L3N2Zz4K'">
                <div class="fish-header">
                    <div class="fish-name">${fishName}</div>
                    <img src="${bait?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzQ0OTVlIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiNlY2YwZjEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkI8L3RleHQ+Cjwvc3ZnPgo='}" alt="${baitName}" class="bait-icon">
                </div>
            </div>
        `;
    }).join('');
    
    updateGridSize();
}

function openFishModal(fishId) {
    const fishItem = fish.find(f => f.id === fishId);
    const fishName = i18n.getFishName(fishId);
    const fishDescription = i18n.getFishDescription(fishId);
    const baitName = i18n.getBaitName(fishItem.favoriteBait);
    const locations = fishItem.locations.map(locId => 
        i18n.getLocationName(locId)
    ).join(', ');

    const modalContent = document.getElementById('modal-fish-details');
    modalContent.innerHTML = `
        <div class="modal-fish-info rarity-${fishItem.rarity}">
            <img src="${fishItem.largeImage}" alt="${fishName}" class="modal-fish-image" onerror="this.src='${fishItem.image}'">
            <h2 class="modal-fish-name">${fishName}</h2>
            <p style="margin-bottom: 2rem; color: var(--text-secondary); font-size: 1.1rem; line-height: 1.6;">${fishDescription}</p>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">${i18n.t('rarity')}</div>
                    <div class="info-value" style="color: var(--rarity-color);">${fishItem.rarity}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${i18n.t('size')}</div>
                    <div class="info-value">${fishItem.size}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${i18n.t('price')}</div>
                    <div class="info-value">${fishItem.price} ${i18n.t('coins')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${i18n.t('favoriteBait')}</div>
                    <div class="info-value">${baitName}</div>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                    <div class="info-label">${i18n.t('fishingLocations')}</div>
                    <div class="info-value">${locations}</div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('fish-modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
}