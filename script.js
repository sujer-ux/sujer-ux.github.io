const rangeInp = document.getElementById('range');
const fader = document.getElementById('fade');
const rotValue = document.getElementById('rot-value');
const rangeTrans = document.querySelector('.rangeTrans');
const circle = document.getElementById('circle');
const audio = document.querySelector('.audio');
const wrapper = document.querySelector('.wrapper');
const playBtn = document.querySelector('.play-pause')
const timeLine = document.getElementById('timeLine');
const timeProgress = document.getElementById('timeProgress');
const muteBlock = document.getElementById('muteBlock');


function rotate() {
    let val_l = rangeInp.value;
    let val = val_l;
//    if (val_l >= 165 & val_l <= 194) {
//        val = 180;
//    } else {
//        val = val_l;
//    }
    let valProc_c = ((val - 45) / 270) * 100;
    let valProc = valProc_c;
//    if (valProc_c >= 45 & valProc_c <= 55) {
//        valProc = 50;
//    } else {
//        valProc = valProc_c;
//    }
    fader.style.transform = 'rotate(' + (val - 180) + 'deg)';
    rangeInp.addEventListener('mouseup', () => {
         rangeTrans.style.transform = 'translateY(' + ((valProc - 50) / 2 / 1.32) + 'vh)';
    })
    function circleRotate() {
        let radius = circle.r.baseVal.value;
        let cirFer = 2 * Math.PI * radius;
        circle.style.strokeDasharray = cirFer + ' ' + cirFer;
        circle.style.strokeDashoffset = cirFer;
        function setProgress(percent) {
            let offset = cirFer - percent / 100 * cirFer;
            circle.style.strokeDashoffset = offset;
        }
        setProgress(valProc / 1.35);
    }
    circleRotate();
    rotValue.innerHTML = Math.trunc(valProc) + '%';
//    rotValue.innerHTML = Math.trunc(val) + 'deg';
    function setValue() {
        let value = valProc / 100;
        audio.volume = value;
        if (audio.volume == 0) {
            wrapper.classList.add('wrapper-mute');
        } else {
            wrapper.classList.remove('wrapper-mute');
        }
        if (audio.volume == 0) {
            muteBlock.addEventListener('click', () => {
                val = val + 4;
                wrapper.classList.remove('wrapper-mute');
            });
        } else {
            muteBlock.addEventListener('click', () => {
                audio.volume = 0;
                wrapper.classList.add('wrapper-mute');
            }); 
        }
    }
    setValue();    
}
rotate();

function setValueCircle(valueVolum) {
    let valueVolumFine;
    const valueCircle = document.getElementById('circle-volume');
    let radius = valueCircle.r.baseVal.value;
    let cirFer = 2 * Math.PI * radius;
    valueCircle.style.strokeDasharray = cirFer + ' ' + cirFer;
    valueCircle.style.strokeDashoffset = cirFer;
    function setProgressValueCircle(percent) {
        let offset = cirFer - percent / 100 * cirFer;
        valueCircle.style.strokeDashoffset = offset;
    }
    valueVolumFine = valueVolum / 1.35;
    setProgressValueCircle(valueVolumFine);
}






let context, analyser, src, array;

function playPause() {
    function playSong() {
        playBtn.classList.add('play');
        audio.play();
        
    }

    function pauseSong() {
        playBtn.classList.remove('play');
        timeLine.style.top = '-13px';
        audio.pause();
    }

    audio.onended = function() {
        pauseSong();
    }

    playBtn.addEventListener('click', () => {
        const isPlaying = playBtn.classList.contains('play');
        if (!context) {
            preparation();
        }
        if (isPlaying) {
            pauseSong();
            timeLine.style.top = '-13px';
//            audio.style.display = 'none';
            
        } else {
            playSong();
            timeLine.style.top = '-7px';
//            audio.style.display = 'block';
        }
    })
}
playPause();

function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }
    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    
    setValueCircle(array[40]);
}



function timeProgressUpdate() {
    audio.ontimeupdate = progressUpdate;
    
    function progressUpdate() {

        let d = audio.duration;
        let c = audio.currentTime;
        let x = timeProgress.style.width = (100 * c) / d + '%';
        currentTimeTime();
//        durationTime();
    }
    
}
timeProgressUpdate();

timeLine.onclick = audioRew;

function audioRew() {
        let w = this.offsetWidth;
        let o = event.offsetX;
        this.value = o/w*100;
        audio.pause();
        audio.currentTime = audio.duration * o/w;
        audio.play();
    
}


//function durationTime() {
//    let timeStamp = audio.duration;
//    let minutes = Math.floor(timeStamp / 60);
//    let seconds = Math.floor(timeStamp % 60);
//    let formatted = [
//        minutes.toString().padStart (2, '0'),
//        seconds.toString().padStart (2, '0')
//    ].join(':');
//
//    const durationBlock = document.querySelector('.duration');
//    durationBlock.innerHTML = formatted;
//}


function currentTimeTime() {
    let timeStamp = audio.currentTime;
    let minutes = Math.floor(timeStamp / 60);
    let seconds = Math.floor(timeStamp % 60);
    let formatted = [
        minutes.toString().padStart (2, '0'),
        seconds.toString().padStart (2, '0')
    ].join(':');

    const currentBlock = document.querySelector('.current');
    currentBlock.innerHTML = formatted;
}

















