// Данные по умолчанию
let images = [
    {
        url: 'cat.jpg',
        title: 'cat',
        desc: 'представляющий опасность',
        tags: ['Существа', 'Коты']
    },
    {
        url: 'fish.jpg',
        title: 'fish',
        desc: 'с недостяжимой свагой',
        tags: ['Существа', 'Подводные']
    },
    {
        url: 'pear.jpg',
        title: 'pear',
        desc: 'с подозрением',
        tags: ['Гуманоиды', 'Фрукты']
    },
    {
        url: 'shrimp.jpg',
        title: 'shrimp',
        desc: 'оскуфевший',
        tags: ['Существа', 'Подводные']
    }
];

let currentTag = 'Все';

function getAllTags() {
    const tagSet = new Set();
    images.forEach(img => img.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
}

function renderFilterButtons() {
    const filterDiv = document.getElementById('filter-buttons');
    filterDiv.innerHTML = '';
    const tags = ['Все', ...getAllTags()];
    tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.textContent = tag;
        btn.className = tag === currentTag ? 'active' : '';
        btn.onclick = () => {
            currentTag = tag;
            renderFilterButtons();
            filterCards();
        };
        filterDiv.appendChild(btn);
    });
}

function createCard(img, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.transitionDelay = (index * 60) + 'ms';
    card.innerHTML = `
        <img src="${img.url}" alt="${img.title}">
        <div class="card-content">
            <div class="card-title">${img.title}</div>
            <div class="card-desc">${img.desc}</div>
            <div class="card-tags">
                ${img.tags.map(tag => `<span class="card-tag">${tag}</span>`).join(' ')}
            </div>
        </div>
    `;
    return card;
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    let filtered = images;
    if (currentTag !== 'Все') {
        filtered = images.filter(img => img.tags.includes(currentTag));
    }
    filtered.forEach((img, idx) => {
        const card = createCard(img, idx);
        gallery.appendChild(card);
        setTimeout(() => card.classList.remove('hide'), 10);
    });
}

function filterCards() {
    const gallery = document.getElementById('gallery');
    const cards = Array.from(gallery.children);
    let filtered = images;
    if (currentTag !== 'Все') {
        filtered = images.filter(img => img.tags.includes(currentTag));
    }
    cards.forEach((card, idx) => {
        const title = card.querySelector('.card-title').textContent;
        const img = filtered.find(img => img.title === title);
        if (!img) {
            card.classList.add('hide');
            setTimeout(() => card.remove(), 400);
        }
    });
    setTimeout(() => {
        renderGallery();
    }, 400);
}

// Добавление нового изображения через форму
const addForm = document.getElementById('add-image-form');
if (addForm) {
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('img-title').value.trim();
        const desc = document.getElementById('img-desc').value.trim();
        const tags = document.getElementById('img-tags').value.split(',').map(t => t.trim()).filter(Boolean);
        const url = document.getElementById('img-url').value.trim();
        if (title && desc && tags.length && url) {
            images.push({ title, desc, tags, url });
            renderFilterButtons();
            filterCards();
            addForm.reset();
        }
    });
}

// Загрузка изображений из JSON-файла
const jsonUpload = document.getElementById('json-upload');
if (jsonUpload) {
    jsonUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                if (Array.isArray(data)) {
                    data.forEach(img => {
                        if (img.title && img.desc && img.tags && img.url) {
                            images.push(img);
                        }
                    });
                    renderFilterButtons();
                    filterCards();
                }
            } catch (err) {
                alert('Ошибка при чтении JSON-файла');
            }
        };
        reader.readAsText(file);
    });
}

window.onload = () => {
    renderFilterButtons();
    renderGallery();
}; 