function startTrack(){
    webgazer.setGazeListener((data, timestamp) =>{
        console.log(data, timestamp);
    }).begin()
}

function hello(){
    console.log('hello world')
}