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





const imgData = context.getImageData( 0, 0, canvas.width, canvas.height);
const data = imgData.data;

// enumerate all pixels
// each pixel's r,g,b,a datum are stored in separate sequential array elements


// creating array to store pixel values
var pixelData = new Array(data.length);

for(let i = 0; i < data.length; i += 4) {
  var red = data[i];
  var green = data[i + 1];
  var blue = data[i + 2];
  var alpha = data[i + 3];

  // creating array of pixel values
  pixelData[i] = [red, green, blue, alpha];
}

// console.log(pixelData);