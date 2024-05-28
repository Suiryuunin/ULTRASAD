const _EXPLOSIONSFX = "Assets/Audio/SFX/boom.wav";
const _THUNKSFX = "Assets/Audio/SFX/thunk.wav";
const _PEWSFX = "Assets/Audio/SFX/pew.wav";
const _DINGSFX = "Assets/Audio/SFX/ding.wav";
const _DEDSFX = "Assets/Audio/SFX/ded.wav";
const YOUAREDEAD = new Audio("Assets/Audio/SFX/YOUAREDEAD.wav");
const Battle01 = new Audio("Assets/Audio/Tracks/Battle01.wav");
document.addEventListener("load", () => Battle01.play());

function InstanceAudio(audioSrc, volume = 0.2)
{
    const audio = new Audio(audioSrc);
    audio.volume = volume;
    return (audio);
}



Battle01.addEventListener("ended", () => Battle01.play());
YOUAREDEAD.addEventListener("ended", () => {if (PLAYER.dying) YOUAREDEAD.play();});
Battle01.volume = 0.5;