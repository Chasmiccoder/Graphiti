let canvas  = document.querySelector('#canvas');
let context = canvas.getContext('2d');
let video   = document.querySelector('#video');

// if the media devices are available, use the navigator object to get the video media
// take the video stream, pass it through a callback function. Set the source of this video to the stream
// of this video and play it in the browser.
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia()) {

    // {video:true, sound:true} for sound as well
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
        video.srcObject = stream;
        video.play();
    }); 
}

document.getElementById('snap').addEventListener('click', ()=>{
    context.drawImage(video, 0, 0, 640, 480); // (x,y axes) = (0,0) Top Left side of the canvas
    // we're changing the dimensions of that picture to match the canvas
});






