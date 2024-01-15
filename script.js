//getting refs to the dom nodes
const volRangeContainer = document.querySelector("#vol-range-container");
const volInput = document.querySelector("#vol-range-container > input");
const volNum = document.querySelector("#vol-num");
const player = document.querySelector("#audio-player");
player.volume = 0.5; //default to half, just like the slider

//globals that will be changed and cleared
let initialPosition = null;
let intervalId = null;

//calculating the halfway point
const volRangeBounding = volRangeContainer.getBoundingClientRect();
const volRangeHalfway = volRangeBounding.x + volRangeBounding.width / 2;

volRangeContainer.addEventListener("mousedown", () => {
  document.onmousemove = trackMouseMovement;
});

document.addEventListener("mouseup", clearMouseData);

function clearMouseData() {
  document.onmousemove = null;
  initialPosition = null;
  volRangeContainer.style.transform = null;
  clearInterval(intervalId);
}

function trackMouseMovement(evt) {
  if (!initialPosition) initialPosition = evt.clientY;
  const upOrDown = evt.clientX >= volRangeHalfway ? 1 : -1;
  volRangeContainer.style.transform = `rotate(${
    (evt.clientY - initialPosition) * upOrDown
  }deg)`;
  const decimalChange = (evt.clientY - initialPosition) / initialPosition;
  changeVolume(changeByCalculator(decimalChange * upOrDown));
}

function changeByCalculator(decimalChange) {
  const percentChange = Math.round(100 * decimalChange);
  const absPercentChange = Math.abs(percentChange);

  if (absPercentChange <= 15) return 1 * Math.sign(percentChange);
  if (absPercentChange <= 30) return 5 * Math.sign(percentChange);
  if (absPercentChange <= 45) return 10 * Math.sign(percentChange);
  return 15 * Math.sign(percentChange);
}

function changeVolume(changeByNum) {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    const newValue = parseInt(volInput.value) + changeByNum;
    volInput.value = `${newValue}`;
    volNum.innerText = `${Math.round(volInput.value / 10)}`;
    player.volume = volInput.value / 1000;
  }, 10);
}

// code to play the music
const playMusic = document.querySelector("#play-music");
playMusic.onclick = () => {
  if (player.paused) {
    player.play();
    playMusic.innerText = "Pause Music";
  } else {
    player.pause();
    playMusic.innerText = "Play Music";
  }
};
