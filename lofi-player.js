document.addEventListener("DOMContentLoaded", function () {
  // Multiple tracks configuration
  const tracks = [
    {
      title: "Midnight Chill",
      artist: "DJ Aurora",
      src: "Music/Lofi.mp3",
    },
    {
      title: "Sunset Groove",
      artist: "BeatSmith",
      src: "Music/lofi-2.mp3",
    },
    {
      title: "Dreamscape",
      artist: "Echoes",
      src: "Music/lofi-3.mp3",
    },
  ];

  const vinyl = document.querySelector(".vinyl");
  const vinylContainer = document.querySelector(".vinyl-player");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const muteBtn = document.getElementById("mute-btn");
  const audioPlayer = document.getElementById("audio-player");

  let currentTrack = 0;
  let isPlaying = false;

  // Set audio element src and properties
  function setTrack(idx) {
    currentTrack = idx;
    audioPlayer.src = tracks[currentTrack].src;
    audioPlayer.volume = 0.3;
    audioPlayer.loop = true;
    updateTrackInfo();
  }
  setTrack(currentTrack);

  // Error handling for audio loading
  audioPlayer.addEventListener("error", function () {
    console.error("Error loading audio:", audioPlayer.error);
    const trackInfo = document.querySelector(".track-info");
    if (trackInfo) {
      trackInfo.innerHTML = `
        <h4>Error loading audio</h4>
        <p>Please try refreshing the page</p>
      `;
    }
  });

  // Update track info and vinyl label
  function updateTrackInfo() {
    const trackInfo = document.querySelector(".track-info");
    const vinylLabel = document.querySelector(".vinyl-label");

    if (tracks[currentTrack]) {
      const track = tracks[currentTrack];

      // Update track info display
      if (trackInfo) {
        trackInfo.innerHTML = `
          <h4>${track.title}</h4>
          <p>${track.artist}</p>
        `;
      }

      // Update vinyl label SVG curved text
      if (vinylLabel) {
        vinylLabel.innerHTML = `
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
              <path id="labelArc" d="M 15 50 A 35 35 0 0 1 85 50" />
            </defs>
            <text font-size="12" fill="#222" font-family="Montserrat, Poppins, sans-serif">
              <textPath xlink:href="#labelArc" startOffset="0">${track.title}</textPath>
            </text>
            <text font-size="10" fill="#555" font-family="Montserrat, Poppins, sans-serif">
              <textPath xlink:href="#labelArc" startOffset="60%">${track.artist}</textPath>
            </text>
          </svg>
        `;
      }
    } else {
      console.error("Current track not found");
    }
  }

  // Update play button icon
  function updatePlayButton() {
    if (!playBtn) return;
    const playIcon = playBtn.querySelector("svg");
    if (!playIcon) return;

    if (isPlaying) {
      playIcon.innerHTML =
        '<polygon points="6 4 10 4 10 20 6 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="14 4 18 4 18 20 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      playIcon.innerHTML =
        '<polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  // Update mute button icon
  function updateMuteButton() {
    if (!muteBtn) return;
    const muteIcon = muteBtn.querySelector("svg");
    if (!muteIcon) return;

    if (audioPlayer.muted) {
      muteIcon.innerHTML =
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      muteIcon.innerHTML =
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  }

  // Toggle play/pause
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      if (vinyl) vinyl.classList.remove("playing");
    } else {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (vinyl) vinyl.classList.add("playing");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          });
      } else {
        if (vinyl) vinyl.classList.add("playing");
      }
    }
    isPlaying = !isPlaying;
    updatePlayButton();
  }

  // Mute/Unmute functionality
  function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    updateMuteButton();
  }

  // Change track (next/prev)
  function changeTrack(direction) {
    let newTrack = currentTrack + direction;
    if (newTrack < 0) newTrack = tracks.length - 1;
    if (newTrack >= tracks.length) newTrack = 0;
    const wasPlaying = isPlaying;

    audioPlayer.pause();
    if (vinyl) vinyl.classList.remove("playing");

    setTrack(newTrack);
    audioPlayer.currentTime = 0;

    if (wasPlaying) {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (vinyl) vinyl.classList.add("playing");
          })
          .catch((error) => {
            console.error("Error playing track:", error);
            isPlaying = false;
            updatePlayButton();
          });
      } else {
        if (vinyl) vinyl.classList.add("playing");
      }
    }
    isPlaying = wasPlaying;
    updatePlayButton();
  }

  // Update play button icon
  function updatePlayButton() {
    const playIcon = playBtn.querySelector("svg");
    if (isPlaying) {
      // Change to pause icon
      playIcon.innerHTML =
        '<polygon points="6 4 10 4 10 20 6 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="14 4 18 4 18 20 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      // Change to play icon
      playIcon.innerHTML =
        '<polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  // Update mute button icon
  function updateMuteButton() {
    const muteIcon = muteBtn.querySelector("svg");
    if (audioPlayer.muted) {
      // Show muted icon
      muteIcon.innerHTML =
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      // Show unmuted icon
      muteIcon.innerHTML =
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  }

  // Event listeners
  playBtn.addEventListener("click", togglePlay);
  muteBtn.addEventListener("click", toggleMute);
  prevBtn.addEventListener("click", () => changeTrack(-1));
  nextBtn.addEventListener("click", () => changeTrack(1));

  // Spacebar to play/pause
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
      e.preventDefault();
      togglePlay();
    }
  });

  // Initialize player
  console.log("Initializing player with tracks:", tracks);
  if (!tracks || tracks.length === 0) {
    console.error("No tracks found");
    return;
  }

  audioPlayer.addEventListener("error", function (e) {
    console.error("Audio error:", e);
    console.error("Audio error details:", {
      error: audioPlayer.error,
      src: audioPlayer.src,
      networkState: audioPlayer.networkState,
      readyState: audioPlayer.readyState,
    });
  });

  updateTrackInfo();
  updatePlayButton();
  updateMuteButton();
});
