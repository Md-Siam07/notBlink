let isSupected = 0;
let canNotify = false;

function startTrack(LOOK_DELAY = 5000){
  window.saveDataAcrossSession = true;

  LEFT_CUTOFF = window.innerWidth * 0.1;
  RIGHT_CUTOFF = window.innerWidth - window.innerWidth * 0.1;
  TOP_CUTOFF = window.innerHeight * 0.1;
  BOTTOM_CUTOFF = window.innerHeight - window.innerHeight * 0.1;

  let startLookTime = Number.POSITIVE_INFINITY;

  webgazer.setGazeListener((data, timestamp) =>{
    if (data == null) {
      if(startLookTime == Number.POSITIVE_INFINITY)
        startLookTime = timestamp;
    }
    else if (!(data.x < LEFT_CUTOFF || data.x > RIGHT_CUTOFF || data.y < TOP_CUTOFF || data.y > BOTTOM_CUTOFF)){
      startLookTime = Number.POSITIVE_INFINITY;
      console.log("IAMHERE");
    }
    else if (startLookTime == Number.POSITIVE_INFINITY) {
      startLookTime = timestamp;
    }

    if (startLookTime + LOOK_DELAY < timestamp && canNotify) {
      console.log("Suspected");
      isSupected = 1;
      startLookTime = Number.POSITIVE_INFINITY;
    }

  }).begin()
}

function yesCanNotifity() {
  canNotify = true;
}

function suspectedStatus() {
  //console.log("Called");
  var status = isSupected;
  isSupected = 0;
  return status;
}

function isScreenWidthHeightOK(){
  //to do
  var screenWidth = screen.width;
  var screenHeight = screen.height;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  //console.log('js: ',screenHeight, windowHeight);
  return (screenWidth == windowWidth && screenHeight*0.8 <= windowHeight);
}

function stopWebGazer(){
  webgazer.end();
}

