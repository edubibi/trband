// Player Logic and Catalog Manager
let filteredCatalog = [...musicCatalog];
let currentSongIndex = -1;
let currentTab = 'all'; // all, registered, pending
let selectedGenre = 'all';

const audioElement = document.getElementById('audio-element');
const catalogList = document.getElementById('catalog-list');
const totalTracksStat = document.getElementById('total-tracks-stat');
const playerPlayBtn = document.getElementById('player-play-btn');
const currentTrackTitle = document.getElementById('current-track-title');
const currentTrackMeta = document.getElementById('current-track-meta');
const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');

// Play/Pause SVG Paths
const PLAY_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_SVG = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

// 1. Initialize and Render Page
function initializeShowcase() {
    musicCatalog.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
    filteredCatalog = [...musicCatalog];
    renderTracks();
    setupAudioListeners();
}


// Render tracks list in the table
function renderTracks() {
    catalogList.innerHTML = '';
    totalTracksStat.textContent = filteredCatalog.length;
    
    filteredCatalog.forEach((song, idx) => {
        const tr = document.createElement('tr');
        tr.className = `track-row ${currentSongIndex !== -1 && musicCatalog[currentSongIndex].title === song.title ? 'playing' : ''}`;
        
        const sgaeBadge = song.registered 
            ? '<span class="badge sgae-reg">SGAE</span>' 
            : '<span class="badge sgae-pending">NUEVO</span>';
            
        const iswc = song.registered ? song.iswc : '-';
        const formats = [];
        if (song.mp3) formats.push('<span class="format-label mp3">MP3</span>');
        if (song.wav) formats.push('<span class="format-label wav">WAV</span>');
        
        tr.innerHTML = `
            <td>
                <button class="play-row-btn" onclick="playSongByName('${song.title.replace(/'/g, "\\'")}')">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </td>
            <td class="track-title-cell" style="font-weight: 600; cursor: pointer;" onclick="playSongByName('${song.title.replace(/'/g, "\\'")}')">${song.title}</td>
            <td><span class="iswc-cell">${iswc}</span></td>
            <td><span class="genre-tag">${song.genre}</span></td>
            <td style="font-size: 0.85rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${song.authors}</td>
            <td style="text-align: right;">${formats.join('')}</td>
        `;
        catalogList.appendChild(tr);
    });
}

// 3. Audio Player Functions
function playSongByName(title) {
    const idx = musicCatalog.findIndex(song => song.title === title);
    if (idx !== -1) {
        playSong(idx);
    }
}

function playSong(index) {
    if (index === currentSongIndex) {
        togglePlayback();
        return;
    }
    
    currentSongIndex = index;
    const song = musicCatalog[currentSongIndex];
    
    const audioPath = song.mp3 ? song.mp3 : null;
    
    if (!audioPath) {
        alert("Este archivo no dispone de versión MP3 para previsualizar localmente.");
        return;
    }
    
    audioElement.src = audioPath;
    audioElement.play().then(() => {
        playerPlayBtn.innerHTML = PAUSE_SVG;
    }).catch(err => {
        console.error("Playback error:", err.message);
        alert("No se pudo iniciar la reproducción local. Comprueba que el archivo existe en tu ruta local: " + song.mp3);
    });
    
    // Update player panel text
    currentTrackTitle.textContent = song.title;
    currentTrackMeta.textContent = `${song.genre} | ${song.registered ? 'ISWC: ' + song.iswc : 'SGAE Pendiente'}`;
    
    // Highlight active row
    renderTracks();
}

function togglePlayback() {
    if (currentSongIndex === -1 && musicCatalog.length > 0) {
        playSong(0);
        return;
    }
    
    if (audioElement.paused) {
        audioElement.play();
        playerPlayBtn.innerHTML = PAUSE_SVG;
    } else {
        audioElement.pause();
        playerPlayBtn.innerHTML = PLAY_SVG;
    }
}

function seekAudio(event) {
    if (!audioElement.src) return;
    const container = event.currentTarget;
    const clickX = event.offsetX;
    const width = container.clientWidth;
    const duration = audioElement.duration;
    
    if (duration) {
        audioElement.currentTime = (clickX / width) * duration;
    }
}

function adjustVolume(event) {
    audioElement.volume = event.target.value;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Setup audio event listeners
function setupAudioListeners() {
    audioElement.addEventListener('timeupdate', () => {
        const cur = audioElement.currentTime;
        const dur = audioElement.duration;
        if (dur) {
            progressBar.style.width = `${(cur / dur) * 100}%`;
            timeCurrent.textContent = formatTime(cur);
        }
    });
    
    audioElement.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audioElement.duration);
    });
    
    audioElement.addEventListener('ended', () => {
        // Auto-play next song
        let nextIdx = currentSongIndex + 1;
        if (nextIdx < musicCatalog.length) {
            playSong(nextIdx);
        } else {
            playerPlayBtn.innerHTML = PLAY_SVG;
            progressBar.style.width = '0%';
            timeCurrent.textContent = '0:00';
        }
    });
}

// Start everything
window.onload = initializeShowcase;
