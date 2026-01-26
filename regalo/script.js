const audio = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const songList = document.getElementById('songList');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playlistBtn = document.getElementById('playlistBtn');
const playlistLayer = document.getElementById('playlistLayer');
const closePlaylist = document.getElementById('closePlaylist');

let songs = [
    { title: "01 Medianoche en la Terraza", file: "01Medianoche-en-la-Terraza.mp3" },
    { title: "All around if you want", file: "All_around_if_you_want.mp3" },
    { title: "Black and grey", file: "Black_and_grey_.mp3" },
    { title: "Close Your Feelings Extended", file: "Close_Your_Feelings_Extended.mp3" },
    { title: "Groove or not", file: "Groove_or_not.mp3" },
    { title: "Heaven s Glow", file: "Heaven_s_Glow.mp3" },
    { title: "Man island beach", file: "Man_island_beach.mp3" },
    { title: "Meanwhile I Love You", file: "Meanwhile_I_Love_You.mp3" },
    { title: "Saxo by the clouds", file: "Saxo_by_the_clouds.mp3" },
    { title: "Saxophone Serenade", file: "Saxophone_Serenade.mp3" },
    { title: "Secret of Velvet", file: "Secret-of-Velvet.mp3" },
    { title: "Sharp echoes", file: "Sharp-echoes.mp3" },
    { title: "Soft corners", file: "Soft-corners.mp3" },
    { title: "Voices for dreams", file: "Voices_for_dreams.mp3" },
    { title: "Woman on the island beach", file: "Woman_on_the_island_beach.mp3" }
];
let currentSongIndex = 0;
let isPlaying = false;

function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    audio.src = `music/${song.file}`;
    songTitle.innerText = song.title;

    document.querySelectorAll('#songList li').forEach((li, i) => {
        li.classList.toggle('active', i === index);
    });
}

function renderPlaylist() {
    songList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="song-num">${(index + 1).toString().padStart(2, '0')}</div>
            <span>${song.title}</span>
        `;
        li.onclick = () => {
            loadSong(index);
            playSong();
            playlistLayer.classList.remove('active');
        };
        songList.appendChild(li);
    });
}

function playSong() {
    isPlaying = true;
    audio.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    document.body.classList.add('playing');
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    document.body.classList.remove('playing');
}

playBtn.onclick = () => {
    if (isPlaying) pauseSong();
    else playSong();
};

nextBtn.onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
};

prevBtn.onclick = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
};

audio.ontimeupdate = () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        durationEl.innerText = formatTime(audio.duration);
    }
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

document.querySelector('.progress-bar').onclick = (e) => {
    const width = e.target.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
};

audio.onended = () => nextBtn.click();
playlistBtn.onclick = () => playlistLayer.classList.add('active');
closePlaylist.onclick = () => playlistLayer.classList.remove('active');

// Init
renderPlaylist();
loadSong(0);
