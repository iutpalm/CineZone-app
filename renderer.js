// Master Local Store Cache Memory
let masterLibrary = [];

// Popular Hero Backup wallpapers
const heroShowcases = [
    { title: "Aadu 3 (2026)", img: "https://images6.alphacoders.com/135/1351676.jpeg" },
    { title: "The Raja Saab (2026)", img: "https://images8.alphacoders.com/134/1347008.jpeg" },
    { title: "Ustaad Bhagat Singh (2026)", img: "https://images8.alphacoders.com/131/1314995.jpeg" }
];

document.addEventListener('DOMContentLoaded', () => {
    buildPopcornflixDashboard();
});

async function buildPopcornflixDashboard() {
    setupHeroBanner();
    
    // Define the scanning tasks for server 172.16.50.14
    const pathways = [
        { rowId: 'rowTrending', path: '/English Movies (1080p)/(2026)' },
        { rowId: 'rowSouthHindi', path: '/SOUTH INDIAN MOVIES/Hindi Dubbed/(2026)' },
        { rowId: 'rowIMDb', path: '/IMDb Top-250 Movies' },
        { rowId: 'rowAnimation', path: '/Animation Movies (1080p)' }
    ];

    // Concurrently fetch lists across the network link
    for (const target of pathways) {
        const result = await window.dhakaFlixAPI.fetchDirectory({ 
            serverKey: 'MOVIES_14', 
            targetPath: target.path 
        });

        if (!result.error) {
            // Clean out empty directory markers, process real film media elements
            const videos = result.filter(file => !file.isDirectory && file.name.toLowerCase().match(/\.(mp4|mkv|webm|avi)$/));
            
            // Map the media items into the master search registry
            videos.forEach(v => masterLibrary.push(v));
            
            populateRow(target.rowId, videos);
        } else {
            document.getElementById(target.rowId).innerHTML = `<div style="color:var(--text-muted);font-size:13px;">Row temporary unavailable offline.</div>`;
        }
    }
}

function populateRow(rowId, elementsList) {
    const targetRow = document.getElementById(rowId);
    targetRow.innerHTML = '';

    if (elementsList.length === 0) {
        targetRow.innerHTML = '<div style="color:var(--text-muted);padding:10px;">No movies found inside this path folder.</div>';
        return;
    }

    elementsList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'popcorn-card';
        card.innerHTML = `
            <div class="poster-frame">🎬</div>
            <div class="movie-name" title="${movie.name}">${movie.name}</div>
        `;
        card.onclick = () => playVideo(movie.url, movie.name);
        targetRow.appendChild(card);
    });
}

function setupHeroBanner() {
    const chooseFeatured = heroShowcases[Math.floor(Math.random() * heroShowcases.length)];
    const banner = document.getElementById('heroBanner');
    banner.style.backgroundImage = `url('${chooseFeatured.img}')`;
    document.getElementById('heroTitle').innerText = chooseFeatured.title;
    
    document.getElementById('heroPlayBtn').onclick = () => {
        // Find if the title exists in the master list, else trigger search feedback
        document.getElementById('globalSearch').value = chooseFeatured.title;
        searchLibrary();
    };
}

// Global Instant Search Execution Layer
function searchLibrary() {
    const keyword = document.getElementById('globalSearch').value.toLowerCase().trim();
    const browseView = document.getElementById('browseContainer');
    const searchView = document.getElementById('searchContainer');
    const searchGrid = document.getElementById('searchGrid');

    if (keyword === '') {
        browseView.style.display = 'block';
        searchView.style.display = 'none';
        return;
    }

    browseView.style.display = 'none';
    searchView.style.display = 'block';
    
    // Filter out matches from the cached memory registry
    const matched = masterLibrary.filter(item => item.name.toLowerCase().includes(keyword));
    
    searchGrid.innerHTML = '';
    document.getElementById('searchTitle').innerText = `Search results for: "${keyword}" (${matched.length})`;

    if (matched.length === 0) {
        searchGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;">No exact matching titles found in memory.</div>';
        return;
    }

    matched.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'popcorn-card';
        card.innerHTML = `
            <div class="poster-frame">🎬</div>
            <div class="movie-name" title="${movie.name}">${movie.name}</div>
        `;
        card.onclick = () => playVideo(movie.url, movie.name);
        searchGrid.appendChild(card);
    });
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
