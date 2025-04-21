console.log("To Chaliye Shuru Karte h Tabahi");
let songs = []                                  // Songs array, will be populated by getsongs()
let currentSong = new Audio();
let currentSongIndex = songs.indexOf(currentSong.src)

// To get song links
const getsongs = async () => {
    let a = await fetch("/Gaane/")         // fetching songs
    let response = await a.text()                               // parsing to become text
    // console.log(response);
    let div = document.createElement("div")                     // creating an element to store text data
    div.innerHTML = response                                    // soring text data
    let as = div.querySelectorAll("a")                          // Selecting all anchor tags
    // console.log(as);
    as.forEach(element => {                                     // storing links in an array
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    });
    // adding song cards
    let cards = document.querySelector(".cards")
    let card = document.createElement("div")
    card.setAttribute('class', "card")
    songs.forEach(song => {
        cards.insertAdjacentHTML('beforeend', `
        <div class="card">
            <div class="cover-wrapper">
                <img src="Cover Imgs/${song.split('Gaane/')[1].replaceAll(/%20|%2C|.mp3/g, " ").trim()}.jpg" class="Playlist-img" alt="">
                <div class="playlist-playbutton">
                    <img src="svgs/playbtn.svg" alt="">
                </div>
            </div>
            <h4 class="Playlist-title">${song.split('Gaane/')[1].replaceAll(/%20|%2C|.mp3/g, " ").trim()}</h4>
            <p class="playlist-description"></p>
        </div>`)
        // console.log(song.split('Gaane/')[1].replaceAll(/%20|%2C|.mp3/g, " ").trim());


    });
    setupPlayButtons();


    return 1;
}
getsongs()

const playsong = (track) => {
    // let audio = new Audio(track)
    currentSong.src = track
    currentSong.play()
    console.log(track + " Track Played");
    document.querySelector(".song-title").innerHTML = track.replace('.mp3', " ").replace('Gaane/', " ")
    document.querySelector(".playbar-songCover").src = `Cover Imgs/${track.replace('.mp3', " ").replace('Gaane/', " ").trim()}.jpg`
    PlayPauseBtn.src = "svgs/pause.svg"
    let CurrentTime = document.querySelector(".CurrentTime")
    let Duration = document.querySelector(".Duration")
    CurrentTime.style.opacity = "1"
    Duration.style.opacity = "1"
}

// Adding event listener to play button of cards
let setupPlayButtons = () => {
    let cards = document.querySelectorAll(".card")
    cards.forEach((card) => {
        let songDiv = card.querySelector(".Playlist-title");
        let playlistPlayButton = card.querySelector(".playlist-playbutton")
        // console.log(songDiv);
        // console.log(playlistPlayButton);
        playlistPlayButton.addEventListener("click", (e) => {
            playsong('Gaane/' + card.querySelector(".Playlist-title").innerHTML + '.mp3')
        })
    })
}
// Adding event listener to play
document.querySelector(".PPbtn").addEventListener("click", () => {
    if (currentSong.src === '') {
        playsong(`Gaane/${songs[Math.floor(Math.random() * 12)].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
    else if (currentSong.paused) {
        currentSong.play()
        PlayPauseBtn.src = "svgs/pause.svg"
    }
    else {
        currentSong.pause()
        PlayPauseBtn.src = "svgs/play.svg"
    }
})

// Adding eventlistener to previous button
prevsongBtn.addEventListener("click", () => {
    currentSongIndex = songs.indexOf(currentSong.src)
    if (currentSong.src === '') {
        playsong(`Gaane/${songs[Math.floor(Math.random() * 12)].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
    else if (currentSongIndex == "0") {
        playsong(`Gaane/${songs[songs.length - 1].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
    else {
        playsong(`Gaane/${songs[currentSongIndex - 1].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
})


// Adding eventlistener to next button
nextsongBtn.addEventListener("click", () => {
    currentSongIndex = songs.indexOf(currentSong.src)
    if (currentSong.src === '') {
        playsong(`Gaane/${songs[Math.floor(Math.random() * 12)].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
    else if (currentSongIndex == songs.length) {
        playsong(`Gaane/${songs[0].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
    else {
        playsong(`Gaane/${songs[currentSongIndex + 1].split('Gaane/')[1].replaceAll(/%20|%2C/g, " ").trim()}`)
    }
})

// To convert seconds into minute in MM:SS format
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Pad minutes and seconds to ensure they are two digits
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}

// listen for seeking in Seekbar
let bar = document.querySelector(".bar")
bar.addEventListener("click", (e) => {
    let clickPosition = e.offsetX / bar.clientWidth;
    currentSong.currentTime = clickPosition * currentSong.duration;
    // console.log(bar.clientWidth);
    // console.log(clickPosition);
});

let bar2 = document.querySelector(".bar2")
bar2.addEventListener("click", (e) => {
    let clickPosition = e.offsetX / bar2.clientWidth;
    currentSong.currentTime = clickPosition * currentSong.duration;
    // console.log(bar2.clientWidth);
    console.log(clickPosition);
});

// Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
    let playedSongCurrentTime = formatTime(currentSong.currentTime);
    let playedSongDuration = formatTime(currentSong.duration);
    document.querySelector(".CurrentTime").innerHTML = playedSongCurrentTime
    document.querySelector(".Duration").innerHTML = playedSongDuration
    let circlewidth = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    // console.log(circlewidth);
    circlewidth == "100%" && nextsongBtn.click();
    document.querySelector(".circle").style.width = circlewidth;
    document.querySelector(".circle2").style.width = circlewidth;

})

// eventlistener for hamburger
let hamburger = document.querySelector(".hamburger")
hamburger.addEventListener("click", () => {
    if (document.querySelector(".left").style.left === "0%") {
        document.querySelector(".left").style.left = "-100%"
    }
    else {
        document.querySelector(".left").style.left = "0%"
    }

})



const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.querySelector('.volume-icon');

// setting default volumebar thumb to max
volumeSlider.value = 100

volumeSlider.addEventListener('input', (event) => {
    const volume = event.target.value;
    // Set the volume of your audio player here
    // Example: audioPlayer.volume = volume / 100;

    // Update the volume icon based on the volume level
    if (volume === 1) {
        volumeIcon.innerHTML = '🔇';
    } else if (volume <= 33) {
        volumeIcon.innerHTML = '🔈';
    } else if (volume <= 66) {
        volumeIcon.innerHTML = '🔉';
    } else { 
        volumeIcon.innerHTML = '🔊';
    }
});

// adding event listener to Mute song on volume icon
document.querySelector(".volume-icon").addEventListener("click", () =>{
    currentSong.volume = 0
    volumeSlider.value = 0
    volumeIcon.innerHTML = '🔇';
})



volumeSlider.addEventListener('input', (event) => {
    const volume = event.target.value / 100;
    //   console.log(volume);
    currentSong.volume = volume;
});