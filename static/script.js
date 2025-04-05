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

// Init to set the play button state correctly
function initPlayButton() {
    if (audio.paused) {
      playBtn.innerHTML = `<i class="ri-play-line"></i>`;
    } else {
      playBtn.innerHTML = `<i class="ri-pause-line"></i>`;
    }
}

function updateProgress() {
  if (audio.duration > 0) {
    const progressWidth = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressWidth}%`;
  }
}

function fetchSongInfo() {
  fetch('https://azura.nullbyte.rip/api/nowplaying/nullradio')
    .then(res => res.json())
    .then(data => {
      const current = data.now_playing;
      if (current.song.id !== lastSongId) {
        title.textContent = current.song.title || 'Unknown Title';
        artist.textContent = current.song.artist || 'Unknown Artist';
        art.src = current.song.art;
        audio.src = current.song.url; // Assuming there's a URL for the audio file
        lastSongId = current.song.id;
      }
    });
}

function fetchWaifu() {
  fetch('/assets/waifus/')
    .then(res => res.json())
    .then(data => {
      const files = data.files;
      if (files.length > 0) {
        const random = files[Math.floor(Math.random() * files.length)];
        waifu.src = `/assets/waifus/${random}`;
      }
    });
}

// Play/pause toggle
playBtn.addEventListener('click', () => {
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
  audio.volume = volumeSlider.value;
});

// Gore/horror-themed quotes (non-repeating until all shown)
const allQuotes = [
  '“You should enjoy the little detours. Because that’s where you’ll find the things more important than what you want.” — Hunter x Hunter',
  '“My whole life was just a game to you, wasn’t it?” — Tokyo Ghoul',
  '“I’m not the protagonist of a novel or anything. I’m a college student who likes to read, like you could find anywhere. But... if, for argument’s sake, you were to write a story with me in the lead role, it would certainly be... a tragedy.” — Oregairu',
  '“I want to rip apart the world and rebuild it with you.” — Re:Zero',
  '“If you die, I’ll kill you.” — Rurouni Kenshin',
  '“The world is not beautiful. Therefore, it is.” — Kino\'s Journey',
  '“I’m not a hero because I want your approval. I do it because I want to.” — One Punch Man',
  '“This world is rotten, and those who are making it rot deserve to die.” — Light Yagami',
  '“It’s not the face that makes someone a monster; it’s the choices they make with their lives.” — Naruto',
  '“A lesson you’ll learn one way or another… When you gaze into the abyss, the abyss gazes back.” — Hellsing',
  '“They look human, but they’re just monsters wearing skin.” — Parasyte',
  '“You can’t spell slaughter without laughter.” — Deadman Wonderland',
  '“Their screams are like music.” — Elfen Lied',
  '“This blood... it’s beautiful.” — Blood-C',
  '“I will tear through your flesh like paper.” — Akame ga Kill!',
  '“Why do I always lose the ones I love, only to be covered in their blood?” — Another',
  '“It’s not death that truly frightens me. It’s forgetting them.” — Tokyo Ghoul',
  '“If I kill you, that means I’m better than you, right?” — Hellsing Ultimate',
  '“I thought if I killed enough, it would fill the hole inside.” — Berserk',
  '“Don’t cry. Even if you’re in pain, you have to look strong in front of others.” — Higurashi no Naku Koro Ni'
];

let quoteQueue = [...allQuotes];

function getRandomQuote() {
  if (quoteQueue.length === 0) {
    quoteQueue = [...allQuotes];
  }
  const index = Math.floor(Math.random() * quoteQueue.length);
  const quote = quoteQueue.splice(index, 1)[0];
  return quote;
}

egg.addEventListener('click', () => {
  egg.textContent = getRandomQuote();
});

// Init
setInterval(updateProgress, 1000);
setInterval(fetchSongInfo, 10000);
setInterval(fetchWaifu, 20000);

fetchSongInfo();
fetchWaifu();
initPlayButton();
volumeSlider.value = audio.volume;
