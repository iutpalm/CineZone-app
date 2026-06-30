let currentServer = 'MOVIES_7';
let currentDirectoryPath = '/English Movies';
let serverPathHistory = [];
let loadedInventoryItems = [];

// Automated Trending Carousel Configuration Array 
const trendingBanners = [
    { title: "Aadu 3 (2026) [1080p Dual Audio]", banner: "https://images6.alphacoders.com/135/1351676.jpeg" },
    { title: "The Raja Saab (2026) [Multi Audio]", banner: "https://images8.alphacoders.com/134/1347008.jpeg" },
    { title: "Ustaad Bhagat Singh (2026)", banner: "https://images8.alphacoders.com/131/1314995.jpeg" }
];

let activeSlideNum = 0;

document.addEventListener('DOMContentLoaded', () => {
    initFeaturedCarousel();
    loadCategory(currentServer, currentDirectoryPath);
});

function initFeaturedCarousel() {
    const track = document.getElementById('sliderTrack');
    track.innerHTML = '';
    trendingBanners.forEach(m => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.backgroundImage = `url('${m.banner}')`;
        slide.innerHTML = `
            <div class="slide-gradient"></div>
            <div class="slide-content">
                <span class="slide-tag">Trending 2026 Uploads</span>
                <h2 class="slide-title">${m.title}</h2>
            </div>
        `;
        track.appendChild(slide);
    });
    setInterval(() => {
        activeSlideNum = (activeSlideNum + 1) % trendingBanners.length;
        track.style.transform = `translateX(-${activeSlideNum * 100}%)`;
    }, 5000);
}

// Core Navigation Entry System Handler
async function loadCategory(serverKey, targetPath) {
    currentServer = serverKey;
    currentDirectoryPath = targetPath;
    
    document.getElementById('currentPath').innerText = `${serverKey}: ${targetPath}`;
    document.getElementById('backBtn').style.display = serverPathHistory.length === 0 ? 'none' : 'inline-block';
    
    const grid = document.getElementById('mediaGrid');
    grid.innerHTML = '<div class="loading">Scanning active FTP cluster streams...</div>';

    const items = await window.CineZoneAPI.fetchDirectory({ serverKey, targetPath });

    if (items.error) {
        grid.innerHTML = `<div class="error-msg">⚠️ Host connection timeout.<br><small>${items.error}</small></div>`;
        return;
    }

    // Capture standard items, stripping hidden data
    loadedInventoryItems = items;
    
    // Clear inputs on folder change
    document.getElementById('nameSearchInput').value = '';
    document.getElementById('genreSelect').value = 'all';
    document.getElementById('yearSelect').value = 'all';

    renderMediaGrid(loadedInventoryItems);
}

function renderMediaGrid(dataset) {
    const grid = document.getElementById('mediaGrid');
    grid.innerHTML = '';

    if (dataset.length === 0) {
        grid.innerHTML = '<div class="loading">No entries match your search criteria.</div>';
        return;
    }

    dataset.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        const isDir = item.isDirectory;
        
        card.innerHTML = `
            <div class="card-icon">${isDir ? '📁' : '🎬'}</div>
            <div class="card-info">
                <div class="card-title" title="${item.name}">${item.name}</div>
                <div class="card-type">${isDir ? 'Folder/Category' : 'Playable Video Link'}</div>
            </div>
        `;

        card.onclick = () => {
            if (isDir) {
                serverPathHistory.push(currentDirectoryPath);
                const completeNextPath = currentDirectoryPath === '/' ? `/${item.name}` : `${currentDirectoryPath}/${item.name}`;
                loadCategory(currentServer, completeNextPath);
            } else {
                playVideo(item.url, item.name);
            }
        };
        grid.appendChild(card);
    });
}

// Global Filter Logic Layer Engine
function applyFilters() {
    const searchString = document.getElementById('nameSearchInput').value.toLowerCase();
    const formatFilter = document.getElementById('genreSelect').value.toLowerCase();
    const yearFilter = document.getElementById('yearSelect').value;

    const filtered = loadedInventoryItems.filter(item => {
        const matchTitle = item.name.toLowerCase().includes(searchString);
        
        // Format Filtering Logic Match Lookups
        let matchFormat = true;
        if (formatFilter !== 'all') {
            matchFormat = item.name.toLowerCase().includes(formatFilter);
        }

        // Year Isolation Lookups (Checks strings or folder names like "(2026)")
        let matchYear = true;
        if (yearFilter !== 'all') {
            if (yearFilter === 'older') {
                matchYear = !['2023', '2024', '2025', '2026'].some(yr => item.name.includes(yr));
            } else {
                matchYear = item.name.includes(yearFilter);
            }
        }

        // Keep directories visible for navigation, apply filters strictly to video files
        return item.isDirectory || (matchTitle && matchFormat && matchYear);
    });

    renderMediaGrid(filtered);
}

function goBack() {
    if (serverPathHistory.length > 0) {
        const previous = serverPathHistory.pop();
        loadCategory(currentServer, previous);
    }
}

function playVideo(url, title) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    document.getElementById('modalVideoTitle').innerText = title;
    player.src = url;
    modal.style.display = 'flex';
}

function closeVideo() {
    const player = document.getElementById('videoPlayer');
    player.pause();
    player.src = '';
    document.getElementById('videoModal').style.display = 'none';
}

function toggleSidebar() {
    document.getElementById('appSidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
}
