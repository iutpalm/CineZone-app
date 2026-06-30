let masterLibraryCache = [];

// Curated array of production backdrop visuals for the interface spotlight header
const premiumShowcases = [
    { title: "Deadpool & Wolverine", img: "https://images6.alphacoders.com/135/1351676.jpeg" },
    { title: "Dune: Part Two", img: "https://images8.alphacoders.com/134/1347008.jpeg" },
    { title: "Spider-Man: Beyond the Spider-Verse", img: "https://images8.alphacoders.com/131/1314995.jpeg" }
];

document.addEventListener('DOMContentLoaded', () => {
    buildPopcornflixHub();
});

async function buildPopcornflixHub() {
    setupCinematicHero();
    
    const operationalRails = [
        { rowId: 'rowTrending', path: '/English Movies (1080p)/(2026)' },
        { rowId: 'rowSouthHindi', path: '/SOUTH INDIAN MOVIES/Hindi Dubbed/(2026)' },
        { rowId: 'rowIMDb', path: '/IMDb Top-250 Movies' },
        { rowId: 'rowAnimation', path: '/Animation Movies (1080p)' }
    ];

    for (const rail of operationalRails) {
        const payload = await window.dhakaFlixAPI.fetchDirectory({ 
            serverKey: 'MOVIES_14', 
            targetPath: rail.path 
        });

        if (!payload.error) {
            const parsedVideos = payload.filter(f => !f.isDirectory && f.name.toLowerCase().match(/\.(mp4|mkv|webm|avi)$/));
            
            // Push items into query cache index memory registry
            parsedVideos.forEach(v => masterLibraryCache.push(v));
            
            renderStreamingRow(rail.rowId, parsedVideos);
        } else {
            document.getElementById(rail.rowId).innerHTML = `<div style="color:var(--text-secondary);font-size:13px;padding:10px;">Cluster Node Unreachable.</div>`;
        }
    }
}

function renderStreamingRow(rowElementId, dataset) {
    const targetContainer = document.getElementById(rowElementId);
    targetContainer.innerHTML = '';

    if (dataset.length === 0) {
        targetContainer.innerHTML = '<div style="color:var(--text-secondary);padding:10px;font-size:13px;">No matching assets found on disk.</div>';
        return;
    }

    dataset.forEach(movie => {
        // Clean up the string name for display on the card
        let cleanName = movie.name.replace(/\([^)]*\)|1080p|720p|\[[^\]]*\]|\.\w+$/gi, '').trim();
        
        // Isolate streaming quality parameters from the file name
        let qualityTag = "HD";
        if (movie.name.toLowerCase().includes("1080p")) qualityTag = "1080p";
        else if (movie.name.toLowerCase().includes("720p")) qualityTag = "720p";
        if (movie.name.toLowerCase().includes("audio")) qualityTag += " [DUAL]";

        const movieCard = document.createElement('div');
        movieCard.className = 'popcorn-card';
        movieCard.innerHTML = `
            <div class="poster-canvas">
                <div class="poster-fallback-art">🎬</div>
                <div class="poster-backdrop-gradient"></div>
                <div class="poster-info-overlay">
                    <span class="card-tag">${qualityTag}</span>
                    <div class="movie-name">${cleanName}</div>
                </div>
            </div>
        `;
        movieCard.onclick = () => playVideo(movie.url, movie.name);
        targetContainer.appendChild(movieCard);
    });
}

function setupCinematicHero() {
    const randomPick = premiumShowcases[Math.floor(Math.random() * premiumShowcases.length)];
    const bannerBox = document.getElementById('heroBanner');
    
    bannerBox.style.backgroundImage = `url('${randomPick.img}')`;
    document.getElementById('heroTitle').innerText = randomPick.title;
    
    document.getElementById('heroPlayBtn').onclick = () => {
        document.getElementById('globalSearch').value = randomPick.title;
        searchLibrary();
    };
}

function searchLibrary() {
    const query = document.getElementById('globalSearch').value.toLowerCase().trim();
    const browsePanel = document.getElementById('browseContainer');
    const searchPanel = document.getElementById('searchContainer');
    const searchDisplayGrid = document.getElementById('searchGrid');

    if (query === '') {
        browsePanel.style.display = 'block';
        searchPanel.style.display = 'none';
        return;
    }

    browsePanel.style.display = 'none';
    searchPanel.style.display = 'block';

    const filteringHits = masterLibraryCache.filter(item => item.name.toLowerCase().includes(query));
    searchDisplayGrid.innerHTML = '';
    document.getElementById('searchTitle').innerText = `Search results for: "${query}" (${filteringHits.length})`;

    if (filteringHits.length === 0) {
        searchDisplayGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:60px;">No matching titles mapped in connection cache index.</div>';
        return;
    }

    filteringHits.forEach(movie => {
        let cleanName = movie.name.replace(/\([^)]*\)|1080p|720p|\[[^\]]*\]|\.\w+$/gi, '').trim();
        const movieCard = document.createElement('div');
        movieCard.className = 'popcorn-card';
        movieCard.innerHTML = `
            <div class="poster-canvas">
                <div class="poster-fallback-art">🎬</div>
                <div class="poster-backdrop-gradient"></div>
                <div class="poster-info-overlay">
                    <div class="movie-name">${cleanName}</div>
                </div>
            </div>
        `;
        movieCard.onclick = () => playVideo(movie.url, movie.name);
        searchDisplayGrid.appendChild(movieCard);
    });
}

function playVideo(url, title) {
    const windowModal = document.getElementById('videoModal');
    const videoNode = document.getElementById('videoPlayer');
    document.getElementById('modalVideoTitle').innerText = title;
    videoNode.src = url;
    windowModal.style.display = 'flex';
}

function closeVideo() {
    const videoNode = document.getElementById('videoPlayer');
    videoNode.pause();
    videoNode.src = '';
    document.getElementById('videoModal').style.display = 'none';
}

function toggleSidebar() {
    document.getElementById('appSidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
}
