// ====   VARIABLES   ===========================================
const activeSlide = document.querySelector('.active-slide');
const controls = activeSlide.querySelector('.controls');
const video = activeSlide.querySelector('#main-video');
const togglePlayBtn = document.querySelector('.toggle-play-btn');
// controls
const repeatVideoBtn = document.querySelector('.repeat-btn');
const pauseVideoBtn = document.querySelector('.active-slide .pause-btn');
const volumeInput = document.querySelector('#volume');
const toggleVolumeBtn = document.querySelector('.toggle-volume-btn');
// slider
const rightArrowBtn = document.querySelector('.arrow-right-btn');
const leftArrowBtn = document.querySelector('.arrow-left-btn');
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
// logic
let numOfVisibleSlides;
let slidesArr = [];
let slide1 = 1;
let slide2 = 2;
let slide3 = 3;
const slidesLength = [...slides].length;
// ====   EVENTS   ===========================================
video.addEventListener('click', togglePlaying);
video.addEventListener('ended', handleVideoEnding);
video.addEventListener('pause', handlePauseEvent);
togglePlayBtn.addEventListener('click', togglePlaying);
// controls
repeatVideoBtn.addEventListener('click', playInLoop);
pauseVideoBtn.addEventListener('click', pauseVideo);
volumeInput.addEventListener('change', changeVolume);
toggleVolumeBtn.addEventListener('click', toggleVolume);
// slider events
slides.forEach((slide) => slide.addEventListener('click', playNewVideo));
rightArrowBtn.addEventListener('click', showNextSlide);
leftArrowBtn.addEventListener('click', showPrevSlide);

// ====   FUNCTIONS  ===========================================
// *** video playing functions
function playNewVideo(e) {
  const slide = e.currentTarget;
  const videoId = slide.dataset.video;
  video.setAttribute('src', `video/video${videoId}.mp4`);
  playVideo();
}
// function isVideoPlaying(video) {
//   !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
// }
function togglePlaying() {
  if (!video.paused) {
    pauseVideo();
  } else {
    playVideo();
  }
}
function playVideo() {
  video.play();
  hidePlayBtn();
  showControls();
}
function playInLoop(e) {
  if (video.hasAttribute('loop')) {
    video.removeAttribute('loop');
    e.currentTarget.setAttribute('title', 'enable loop');
    return;
  }
  video.setAttribute('loop', true);
  e.currentTarget.setAttribute('title', 'disable loop');
}
function pauseVideo() {
  video.pause();
  showPlayBtn();
  hideControls();
}
function handleVideoEnding() {
  showPlayBtn();
  togglePlayBtn.classList.remove('paused');
  hideControls();
}
function handlePauseEvent() {
  togglePlayBtn.classList.add('paused');
}
function showPlayBtn() {
  togglePlayBtn.classList.remove('hidden');
}
function hidePlayBtn() {
  togglePlayBtn.classList.add('hidden');
}
function showControls() {
  controls.removeAttribute('aria-hidden');
  controls.classList.remove('hidden');
  pauseVideoBtn.addEventListener('click', pauseVideo);
  volumeInput.addEventListener('change', changeVolume);
  toggleVolumeBtn.addEventListener('click', toggleVolume);
}
function hideControls() {
  controls.setAttribute('aria-hidden', true);
  controls.classList.add('hidden');
  pauseVideoBtn.removeEventListener('click', pauseVideo);
  volumeInput.removeEventListener('change', changeVolume);
  toggleVolumeBtn.removeEventListener('click', toggleVolume);
}
function changeVolume(e) {
  video.volume = e.currentTarget.value / 100;
  if (video.volume === 0 && !toggleVolumeBtn.classList.contains('volume-disabled')) {
    toggleVolumeBtn.classList.add('volume-disabled');
  } else {
    toggleVolumeBtn.classList.remove('volume-disabled');
  }
}
function toggleVolume(e) {
  const volumeBtn = e.currentTarget;
  if (video.volume > 0) {
    video.volume = 0;
    volumeBtn.classList.add('volume-disabled');
    return;
  }
  video.volume = volumeInput.value / 100;
  volumeBtn.classList.remove('volume-disabled');
}
function playVolume() {
  video.volume = volumeInput.value / 100;
}
// *** slider functions
function showNextSlide() {
  // remove previous styles
  resetSlidesStyle();
  for (let i = 0; i < slidesArr.length; i++) {
    const num1 = slidesArr[i][0];
    const num2 = slidesArr[i][1];
    const num3 = slidesArr[i][2];
    if (slide1 === num1 && slide2 === num2 && slide3 === num3) {
      slide1 = slidesArr[i + 1][0];
      slide2 = slidesArr[i + 1][1];
      slide3 = slidesArr[i + 1][2];
      break;
    }
  }
  styleSlides();
  updateArrowBtns();
  return;
}
function showPrevSlide() {
  // remove previous styles
  resetSlidesStyle();
  for (let i = 0; i < slidesArr.length; i++) {
    const num1 = slidesArr[i][0];
    const num2 = slidesArr[i][1];
    const num3 = slidesArr[i][2];
    if (slide1 === num1 && slide2 === num2 && slide3 === num3) {
      slide1 = slidesArr[i - 1][0];
      slide2 = slidesArr[i - 1][1];
      slide3 = slidesArr[i - 1][2];
      break;
    }
  }
  styleSlides();
  updateArrowBtns();
  return;
}
function resetSlidesStyle() {
  slides.forEach((slide) => (slide.style.gridColumn = 'unset'));
}
function styleSlides() {
  const slide1El = document.querySelector(`#slide-${slide1}`);
  const slide2El = document.querySelector(`#slide-${slide2}`);
  const slide3El = document.querySelector(`#slide-${slide3}`);
  slide1El.style.gridColumn = '1 / 2';
  slide2El.style.gridColumn = '2 / 3';
  slide3El.style.gridColumn = '3 / 4';
}
function disableRightArrowBtn() {
  rightArrowBtn.classList.add('disabled');
  rightArrowBtn.removeEventListener('click', showNextSlide);
}
function enableRightArrowBtn() {
  rightArrowBtn.classList.remove('disabled');
  rightArrowBtn.addEventListener('click', showNextSlide);
}
function disableLeftArrowBtn() {
  leftArrowBtn.classList.add('disabled');
  leftArrowBtn.removeEventListener('click', showPrevSlide);
}
function enableLeftArrowBtn() {
  leftArrowBtn.classList.remove('disabled');
  leftArrowBtn.addEventListener('click', showPrevSlide);
}
function updateArrowBtns() {
  if (slide2 === slidesLength || slide3 === slidesLength) {
    disableRightArrowBtn();
    enableLeftArrowBtn();
  } else if (slide1 <= 1) {
    disableLeftArrowBtn();
    enableRightArrowBtn();
  } else {
    enableLeftArrowBtn();
    enableRightArrowBtn();
  }
}
// ***** initialisation functions
function initializeSlider() {
  for (let i = 1; i <= slidesLength; i++) {
    let first = i;
    let second = i + 1;
    let third = i + 2;
    if (third > slidesLength) {
      third = i + 1;
      second = i;
      first = i - 1;
    } else if (second > slidesLength) {
      console.log(i);
      third = i;
      second = i - 1;
      first = i - 2;
    }
    slidesArr.push([first, second, third]);
    i += 2;
  }
  updateArrowBtns();
}

// start
initializeSlider();
playVolume();
