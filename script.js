const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
let currentSong = new Audio();

let songs;
let currFolder;

function formatSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    
    let a = await fetch(`/${folder}/`);
    let response = await a.text();

     let div = document.createElement("div"); 
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            const name = element.href.split("/").pop();
            songs.push(name);
        }
    }

    console.log("Final Songs Array:", songs);
    return songs;
}

const playMusic = (track, pause = false) => {
    console.log("Playing track:", track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    play.src = "pause.svg";
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
};


async function loadAndRenderSongs(folder) {
    songs = await getSongs(folder);

    let songUl = document.querySelector(".songList ul");
    songUl.innerHTML = ""; 

    for (const song of songs) {
            const decodedName = decodeURIComponent(song); 

        songUl.innerHTML += `<li><img class="invert" src="music.svg" alt="">
            <div class="info">
                    <div>${decodedName}</div>   
           
                <div>Harry</div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div> </li>`;
    }


    if (songs.length > 0) {
        playMusic(songs[0], true);
    }
}
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div)
   let anchors=  div.getElementsByTagName("a")
   let cardContainer= document.querySelector(".cardContainer")
  let array = Array.from (anchors)
    for(let index = 0; index<= Array.length;index++){
        const e = array[index];
    
    if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-2)[0]
      // Get the metadata of the folder
      let res = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);

    let response = await res.json();

    cardContainer.innerHTML = cardContainer.innerHTML +`<div  data-folder="${folder}" class="card ">

                        <div   class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                                fill="#000" style="color: black;">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img 
                        aria-hidden="false" draggable="false" loading="eager"
                            src="/songs/${folder}/cover.jpeg"
                            alt=""
                            class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj"
                            sizes="(min-width: 1280px) 232px, 192px">

                        <h2>${response.title}</h2>
                        <p>${response.description} </p>


                </div>`
    }
    
   }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folder = item.currentTarget.dataset.folder;
            await loadAndRenderSongs(`songs/${folder}`);
        });
    });

}


async function main() {
    await loadAndRenderSongs("songs/ncs");
 playMusic(songs[0],true)
// Display all the albums on the page
displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML =
            `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        let currentFileName = decodeURI(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFileName);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let currentFileName = decodeURI(currentSong.src.split("/").pop());
        let index = songs.indexOf(currentFileName);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

   document.querySelector(".volume>img").addEventListener("click",e=>{



    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg" , "mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value= 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg" , "volume.svg")
         currentSong.volume =.10;
                 document.querySelector(".range").getElementsByTagName("input")[0].value= 10;

    }
   })
}

main();


