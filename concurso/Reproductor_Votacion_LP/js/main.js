// =========================================
// REPRODUCTOR MUSICAL PORTÁTIL
// =========================================

// URL del Web App de Google Apps Script (Reemplazar con tu URL definitiva de Google Sheets)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9SQxWqYb2LxM4bh3z1r_whE-Z3SG-JhrOsriBAx3jDSTTtu6CIZ6fSKLUjPDRoszJ2w/exec";

document.addEventListener('DOMContentLoaded', () => {
    initAudioPlayer();
});

let currentTrackIndex = 0;
let isPlaying = false;
let activeTracks = [];
let selectedTracks = new Set();
const MAX_VOTES = 15;

function initAudioPlayer() {
    activeTracks = window.dynamicAudioTracks || [];
    
    const audio = document.getElementById('main-audio-player');
    const playBtn = document.getElementById('btn-play');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const titleDisplay = document.getElementById('current-track-title');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const playlist = document.getElementById('playlist-list');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (!audio || !playBtn) return;
    
    if (activeTracks.length === 0) {
        titleDisplay.textContent = "No hay canciones cargadas";
        return;
    }

    // Función para limpiar y profesionalizar los títulos
    function formatTitle(title) {
        let clean = title;
        // 1. Quitar números del principio (01, 02_) y caracteres raros
        clean = clean.replace(/^\d+/, '').replace(/^[-_\s"“”]+/, '');
        // 2. Reemplazar guiones bajos Y guiones normales por espacios
        clean = clean.replace(/[_-]/g, ' ');
        // 3. Quitar números de versión o tomas al final (ej: " 2", " 44", " v2")
        clean = clean.replace(/\s\d+$/, '').replace(/\s?v\d+$/i, '');
        // 4. Quitar palabras como "mezcla", "EDIT", "FULL", "Extend" al final
        clean = clean.replace(/\s?\(?mezcla\)?$/i, '').replace(/\s?\(?edit\)?$/i, '').replace(/\s?\(?full\)?$/i, '').replace(/\s?\(?extend\)?$/i, '');
        // 5. Arreglar TODO MAYÚSCULAS (Convertir "ME QUITAS TODO" a "Me quitas todo")
        let uppercaseCount = (clean.match(/[A-Z]/g) || []).length;
        if (uppercaseCount > clean.length * 0.4) {
            clean = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
        }
        
        return clean.trim();
    }

    // Elementos del sistema de votos
    const voteCountEl = document.getElementById('vote-count');
    const btnSubmitVotes = document.getElementById('btn-submit-votes');
    const modalCredits = document.getElementById('modal-credits');
    const btnCloseModal = document.getElementById('modal-close');
    const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');
    const inputVoterName = document.getElementById('voter-name');
    const votingPanel = document.getElementById('voting-panel');

    // Comprobar si ya ha votado en este navegador
    const hasVoted = localStorage.getItem('trband_voted') === 'true';

    if (hasVoted) {
        if (votingPanel) {
            votingPanel.innerHTML = '<p style="color:#25D366; font-weight:bold; width:100%; text-align:center;">¡Ya has enviado tus votos! Muchas gracias por participar en el disco.</p>';
        }
    }

    function updateVoteUI() {
        if (hasVoted) return;
        if(voteCountEl) voteCountEl.textContent = selectedTracks.size;
        if (selectedTracks.size === MAX_VOTES) {
            if(btnSubmitVotes) {
                btnSubmitVotes.disabled = false;
            }
        } else {
            if(btnSubmitVotes) {
                btnSubmitVotes.disabled = true;
            }
        }
    }

    // 1. Generar la playlist con números y botón de voto
    activeTracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.dataset.index = index;
        
        const cleanTitle = formatTitle(track.title);
        
        const btnVote = document.createElement('button');
        btnVote.className = 'vote-btn';
        if (hasVoted) {
            btnVote.innerHTML = '🔒';
            btnVote.style.cursor = 'not-allowed';
            btnVote.style.opacity = '0.5';
            btnVote.title = 'Ya has enviado tus votos';
        } else {
            btnVote.innerHTML = '🤍';
            btnVote.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que la canción empiece a sonar al votar
                if (selectedTracks.has(index)) {
                    selectedTracks.delete(index);
                    btnVote.innerHTML = '🤍';
                    btnVote.classList.remove('selected');
                } else {
                    if (selectedTracks.size >= MAX_VOTES) {
                        alert("¡Ya has elegido tus 15 temas! Quita alguno si quieres añadir este.");
                        return;
                    }
                    selectedTracks.add(index);
                    btnVote.innerHTML = '❤️';
                    btnVote.classList.add('selected');
                }
                updateVoteUI();
            });
        }

        const trackNameSpan = document.createElement('span');
        trackNameSpan.className = 'track-name';
        trackNameSpan.textContent = (index + 1) + ". " + cleanTitle;
        
        li.appendChild(btnVote);
        li.appendChild(trackNameSpan);
        
        li.addEventListener('click', () => {
            loadTrack(index);
            playAudio();
        });
        
        playlist.appendChild(li);
    });

    // Lógica del Panel y Modal
    if(btnSubmitVotes) {
        btnSubmitVotes.addEventListener('click', () => {
            if (selectedTracks.size === MAX_VOTES) {
                modalCredits.classList.remove('hidden');
            }
        });
    }

    if(btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modalCredits.classList.add('hidden');
        });
    }

    const btnSubmitForm = document.getElementById('btn-submit-form');
    const inputVoterEmail = document.getElementById('voter-email');
    const submitStatusMsg = document.getElementById('submit-status-msg');

    if (btnSubmitForm) {
        btnSubmitForm.addEventListener('click', () => {
            const name = inputVoterName.value.trim();
            const email = inputVoterEmail.value.trim();
            
            if (!name || !email) {
                alert("Por favor, introduce tu nombre y tu correo electrónico.");
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Por favor, introduce un correo electrónico válido.");
                return;
            }

            btnSubmitForm.disabled = true;
            btnSubmitForm.textContent = "Enviando votos...";
            if (submitStatusMsg) {
                submitStatusMsg.style.display = "block";
                submitStatusMsg.style.color = "#cbd5e1";
                submitStatusMsg.textContent = "Procesando votos...";
            }

            // Recopilar los títulos de las canciones elegidas
            const chosenSongs = [];
            selectedTracks.forEach(trackIndex => {
                chosenSongs.push(formatTitle(activeTracks[trackIndex].title));
            });

            // Enviar datos al Apps Script de Google Sheets
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Para evitar problemas de CORS de redirección de Google
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    votos: chosenSongs.join(", ")
                })
            })
            .then(() => {
                localStorage.setItem('trband_voted', 'true');
                if (submitStatusMsg) {
                    submitStatusMsg.style.color = "#25D366";
                    submitStatusMsg.textContent = "¡Votos registrados con éxito! Muchas gracias.";
                }
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                console.error("Error al enviar votos:", error);
                alert("Hubo un problema al enviar tus votos. Por favor, comprueba tu conexión e inténtalo de nuevo.");
                btnSubmitForm.disabled = false;
                btnSubmitForm.textContent = "Confirmar y Enviar Votos";
                if (submitStatusMsg) {
                    submitStatusMsg.style.display = "none";
                }
            });
        });
    }

    // Cargar la primera pista
    loadTrack(0);

    // 2. Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + activeTracks.length) % activeTracks.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % activeTracks.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % activeTracks.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    progressContainer.addEventListener('click', setProgress);

    // Funciones Helper
    function loadTrack(index) {
        currentTrackIndex = index;
        audio.src = activeTracks[index].src;
        const cleanTitle = formatTitle(activeTracks[index].title);
        titleDisplay.textContent = (index + 1) + ". " + cleanTitle;
        
        // Actualizar UI de playlist
        const items = playlist.querySelectorAll('.playlist-item');
        items.forEach(el => el.classList.remove('playing'));
        if(items[index]) {
            items[index].classList.add('playing');
        }
    }

    function playAudio() {
        audio.play();
        isPlaying = true;
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        
        if (isNaN(duration)) return;
        
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Actualizar tiempos en texto
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }
}
