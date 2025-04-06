const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const volumeSlider = document.getElementById('volume-slider');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const art = document.getElementById('art');
const progress = document.getElementById('progress-bar');
const waifu = document.getElementById('waifu');
const egg = document.getElementById('easter-egg');

let lastSongId = null;
let songDuration = 0;  // Store duration fetched from the API
let songElapsed = 0;   // Store elapsed time fetched from the API

// Init to set the play button state correctly
function initPlayButton() {
    console.log('Initializing play button...');
    if (audio.paused) {
        playBtn.innerHTML = `<i class="ri-play-line"></i>`;
    } else {
        playBtn.innerHTML = `<i class="ri-pause-line"></i>`;
    }
}

// Function to update progress bar
function updateProgress() {
    console.log('Updating progress...');
    songElapsed++;
    if (songDuration == songElapsed) {
      songDuration = 0
    }
    console.log(songDuration)
    if (songDuration === 0) {
        console.warn("Song duration is not available from the API.");
        return; // Prevent updating if no duration is available
    }

    // Use songElapsed for the current time from API
    const progressWidth = (songElapsed / songDuration) * 100;
    console.log(`Elapsed Time: ${songElapsed}, Duration: ${songDuration}, Progress: ${progressWidth}%`);

    // Set the width of the progress bar based on elapsed time and duration
    progress.style.width = `${progressWidth}%`;

    // Debugging logs for progress width
    if (isNaN(progressWidth)) {
        console.error("Progress width calculation failed. elapsed or duration is invalid.");
    }
}

// Function to fetch song info
function fetchSongInfo() {
    console.log('Fetching song info...');
    fetch('https://azura.nullbyte.rip/api/nowplaying/nullradio')
        .then(res => res.json())
        .then(data => {
            const current = data.now_playing;
            if (current.song.id !== lastSongId) {
                console.log('New song detected. Updating title, artist, and artwork.');
                title.textContent = current.song.title || 'Unknown Title';
                artist.textContent = current.song.artist || 'Unknown Artist';
                art.src = current.song.art;

                // Use the first mount's URL as the audio source
                const streamUrl = data.station.mounts[0].url; // This is the correct URL for the audio stream
                audio.src = streamUrl; // Set the stream URL to the audio element

                // Fetch the duration and elapsed from the API
                songDuration = current.duration || 0;  // Total duration in seconds
                songElapsed = current.elapsed || 0;    // Elapsed time in seconds

                lastSongId = current.song.id;
            }
        })
        .catch(err => {
            console.error('Error fetching song info:', err);
        });
}

// Fetch waifu image
function fetchWaifu() {
    console.log('Fetching waifu image...');
    fetch('/assets/waifus/')
        .then(res => res.json())
        .then(data => {
            const files = data.files;
            if (files.length > 0) {
                const random = files[Math.floor(Math.random() * files.length)];
                waifu.src = `/assets/waifus/${random}`;
            }
        })
        .catch(err => {
            console.error('Error fetching waifu image:', err);
        });
}

// Play/pause toggle
playBtn.addEventListener('click', () => {
    console.log('Toggling play/pause...');
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = `<i class="ri-pause-line"></i>`;
    } else {
        audio.pause();
        playBtn.innerHTML = `<i class="ri-play-line"></i>`;
    }
});

// Volume control
volumeSlider.addEventListener('input', () => {
    console.log('Adjusting volume to:', volumeSlider.value);
    audio.volume = volumeSlider.value;
});

// Gore/horror-themed quotes (non-repeating until all shown)
const allQuotes = [
    "In order to escape a cruel reality, I always had to act strong… But I'm not strong. I'm empty. — Gaara, Naruto",
    "I mustn't run away. I mustn't run away. I mustn't run away... — Shinji Ikari, Neon Genesis Evangelion",
    "It’s better to be hurt than to hurt others. Nice people can be happy with just that. — Kaneki Ken, Tokyo Ghoul",
    "You shouldn't have to bear it all alone. You should talk to someone. You should cry when you want to cry. — Tomoya Okazaki, Clannad: After Story",
    "Maybe there's only a dark road up ahead. But you still have to believe and keep going. — Kaori Miyazono, Your Lie in April",
    "I always thought that people who were alone were weak. I was wrong. — C.C., Code Geass",
    "Living is pain. It’s only natural to die. — Envy, Fullmetal Alchemist: Brotherhood",
    "A lesson without pain is meaningless. — Edward Elric, Fullmetal Alchemist: Brotherhood",
    "I'm fine… I’m just broken. — Homura Akemi, Madoka Magica",
    "It hurts. It hurts so much. — Menma, Anohana",
    "I'm just tired. Tired of everything. — Unknown, Various",
    "If I disappear, will anyone notice? — Unknown, Various",
    "Crying is not a sign of weakness. — Izumi Curtis, Fullmetal Alchemist: Brotherhood",
    "I wish someone would tell me it’s okay to not be okay. — Unknown, Various",
    "Even if I cry, even if I scream, it won’t bring them back. — Mikaela Hyakuya, Seraph of the End",
    "I’m scared of what’s inside me. — Lucy, Elfen Lied",
    "I feel like I’m slowly dying inside. — Unknown, Various",
    "Loneliness is eating me alive. — Crona, Soul Eater",
    "Being alone is more painful than getting hurt. — Monkey D. Luffy, One Piece",
    "I’m sick of pretending to be okay. — Unknown, Various"
];


let quoteQueue = [...allQuotes];

function getRandomQuote() {
    console.log('Getting random quote...');
    if (quoteQueue.length === 0) {
        quoteQueue = [...allQuotes];
    }
    const index = Math.floor(Math.random() * quoteQueue.length);
    const quote = quoteQueue.splice(index, 1)[0];
    return quote;
}

egg.addEventListener('click', () => {
    console.log('Egg clicked! Displaying random quote...');
    egg.textContent = getRandomQuote();
});

// Init
console.log('Starting intervals...');
setInterval(fetchSongInfo, 10000);
setInterval(fetchWaifu, 20000);
setInterval(updateProgress, 1000);

// Initialize song info fetch
fetchSongInfo();
fetchWaifu();
initPlayButton();
volumeSlider.value = audio.volume;

console.log('Page fully loaded.');
