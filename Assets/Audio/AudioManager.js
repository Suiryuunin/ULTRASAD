const _EXPLOSIONSFX = "Assets/Audio/SFX/boom.wav";
const Battle01 = new Audio("Assets/Audio/Tracks/Battle01.wav");
document.addEventListener("load", () => Battle01.play());

function InstanceAudio(audioSrc, volume = 0.2)
{
    const audio = new Audio(audioSrc);
    audio.volume = volume;
    return (audio);
}



window.addEventListener("click", () => Battle01.play());
window.addEventListener("keydown", () => Battle01.play());
Battle01.addEventListener("ended", (e) => Battle01.play());
Battle01.volume = 0.5;