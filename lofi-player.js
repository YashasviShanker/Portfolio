document.addEventListener('DOMContentLoaded', function() {
  // Single track configuration
  const track = {
    title: 'Lofi Study',
    artist: 'Chillhop',
    src: 'https://assets.codepen.io/3364143/7b5630fd-9d6d-4907-aa60-609571b686f8.mp3' // Using a more reliable audio source
  };
  const tracks = [track]; // Keep as array for compatibility
  
  const vinyl = document.querySelector('.vinyl');
  const vinylContainer = document.querySelector('.vinyl-player');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const muteBtn = document.getElementById('mute-btn');
  const audioPlayer = new Audio(track.src);
  
  let currentTrack = 0;
  let isPlaying = false;
  
  // Set initial volume (low by default) and handle errors
  audioPlayer.volume = 0.3;
  audioPlayer.loop = true;
  
  // Error handling for audio loading
  audioPlayer.addEventListener('error', function() {
    console.error('Error loading audio:', audioPlayer.error);
    const trackInfo = document.querySelector('.track-info');
    if (trackInfo) {
      trackInfo.innerHTML = `
        <h4>Error loading audio</h4>
        <p>Please try refreshing the page</p>
      `;
    }
  });
  
  // Update track info and vinyl label
  function updateTrackInfo() {
    const trackInfo = document.querySelector('.track-info');
    const vinylLabel = document.querySelector('.vinyl-label');
    
    if (tracks[currentTrack]) {
      const track = tracks[currentTrack];
      
      // Update track info display
      if (trackInfo) {
        trackInfo.innerHTML = `
          <h4>${track.title}</h4>
          <p>${track.artist}</p>
        `;
      }
      
      // Update vinyl label
      if (vinylLabel) {
        // Split long titles into two lines if needed
        const titleParts = track.title.split(' ');
        const firstHalf = titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ');
        const secondHalf = titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ');
        
        vinylLabel.innerHTML = `
          <div class="label-text">
            <div class="label-title">${firstHalf}</div>
            ${secondHalf ? `<div class="label-title">${secondHalf}</div>` : ''}
            <div class="label-artist">${track.artist}</div>
          </div>
        `;
      }
    } else {
      console.error('Current track not found');
    }
  }
  
  // Update play button icon
  function updatePlayButton() {
    if (!playBtn) return;
    const playIcon = playBtn.querySelector('svg');
    if (!playIcon) return;
    
    if (isPlaying) {
      playIcon.innerHTML = '<polygon points="6 4 10 4 10 20 6 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="14 4 18 4 18 20 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }
  
  // Update mute button icon
  function updateMuteButton() {
    if (!muteBtn) return;
    const muteIcon = muteBtn.querySelector('svg');
    if (!muteIcon) return;
    
    if (audioPlayer.muted) {
      muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  }
  
  // Toggle play/pause
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      if (vinyl) vinyl.classList.remove('playing');
    } else {
      audioPlayer.play()
        .then(() => {
          if (vinyl) vinyl.classList.add('playing');
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
    isPlaying = !isPlaying;
    updatePlayButton();
  }
  
  // Mute/Unmute functionality
  function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    updateMuteButton();
  }
  
  // Change track (kept for compatibility but will loop the same track)
  function changeTrack() {
    // Restart the same track
    const wasPlaying = isPlaying;
    
    if (wasPlaying) {
      audioPlayer.pause();
      if (vinyl) vinyl.classList.remove('playing');
    }
    
    audioPlayer.currentTime = 0;
    updateTrackInfo();
    
    if (wasPlaying) {
      audioPlayer.play()
        .then(() => {
          if (vinyl) vinyl.classList.add('playing');
        })
        .catch(error => {
          console.error('Error playing track:', error);
          isPlaying = false;
          updatePlayButton();
        });
    }
  }
  
  // Update play button icon
  function updatePlayButton() {
    const playIcon = playBtn.querySelector('svg');
    if (isPlaying) {
      // Change to pause icon
      playIcon.innerHTML = '<polygon points="6 4 10 4 10 20 6 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="14 4 18 4 18 20 14 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    } else {
      // Change to play icon
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }
  
  // Update mute button icon
  function updateMuteButton() {
    const muteIcon = muteBtn.querySelector('svg');
    if (audioPlayer.muted) {
      // Show muted icon
      muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      // Show unmuted icon
      muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  }
  
  // Event listeners
  playBtn.addEventListener('click', togglePlay);
  muteBtn.addEventListener('click', toggleMute);
  prevBtn.addEventListener('click', () => changeTrack(-1));
  nextBtn.addEventListener('click', () => changeTrack(1));
  
  // Spacebar to play/pause
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && document.activeElement.tagName !== 'BUTTON') {
      e.preventDefault();
      togglePlay();
    }
  });
  
  // Initialize player
  console.log('Initializing player with tracks:', tracks);
  if (!tracks || tracks.length === 0) {
    console.error('No tracks found');
    return;
  }
  
  audioPlayer.addEventListener('error', function(e) {
    console.error('Audio error:', e);
    console.error('Audio error details:', {
      error: audioPlayer.error,
      src: audioPlayer.src,
      networkState: audioPlayer.networkState,
      readyState: audioPlayer.readyState
    });
  });
  
  updateTrackInfo();
  updatePlayButton();
  updateMuteButton();
});
