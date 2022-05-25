

function startTrack(LOOK_DELAY = 5000){
  window.saveDataAcrossSession = true;

  LEFT_CUTOFF = window.innerWidth * 0.1;
  RIGHT_CUTOFF = window.innerWidth - window.innerWidth * 0.1;
  TOP_CUTOFF = window.innerHeight * 0.1;
  BOTTOM_CUTOFF = window.innerHeight - window.innerHeight * 0.1;

  let startLookTime = Number.POSITIVE_INFINITY;

  webgazer.setGazeListener((data, timestamp) =>{
    console.log(data);
    if (data == null) {
      // ----
    }
    if (!(data.x < LEFT_CUTOFF || data.x > RIGHT_CUTOFF || data.y < TOP_CUTOFF || data.y > BOTTOM_CUTOFF)){
      startLookTime = Number.POSITIVE_INFINITY;
    }
    else if (startLookTime == Number.POSITIVE_INFINITY) {
      startLookTime = timestamp;
    }

    if (startLookTime + LOOK_DELAY < timestamp) {
      console.log("Suspected");
      startLookTime = Number.POSITIVE_INFINITY;
    }

  }).begin()
}

