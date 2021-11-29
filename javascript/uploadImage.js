// Select required elements
const dropArea = document.querySelector('.drag-area');
const dragText = dropArea.querySelector("header");
const button = dropArea.querySelector('button'); 
const input = dropArea.querySelector('input');

// global var
let file;

button.onclick = ()=> {
    input.click(); // if the user clicks on the button, then the input field (that is hidden) also gets clicked
};

input.addEventListener('change', function() {
    file = this.files[0];
    showFile();
    dropArea.classList.add('active');
});


// If the user drags a file over the dropArea
dropArea.addEventListener('dragover', (event)=> {
    // default behavior is to open the image in a new tab once dropped
    event.preventDefault(); 

    dropArea.classList.add('active');
    dragText.textContent = 'Release to Upload!';
});

// While dragging a file, if the user leaves the dropArea
dropArea.addEventListener('dragleave', ()=> {
    // console.log('File is outside the Drop Area');
    dropArea.classList.remove('active');
    dragText.textContent = 'Drag & Drop to Upload File';
});

// If the user drops a dragged file in the dropArea
dropArea.addEventListener('drop', (event)=> {
    event.preventDefault();
    // console.log('File has been dropped in the Drop Area');

    file = event.dataTransfer.files[0]; // [0] to select the first file, if the user drops multiple

    showFile();

});


// shows file if it is an image file  [change function name]
function showFile() {

    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if(validExtensions.includes(fileType)) {
        console.log('Valid File!');
        let fileReader = new FileReader(); // converts the image to a data url
        fileReader.onload = ()=> {
            let fileURL = fileReader.result;
            // console.log(fileURL); // we get the image in base64 format
            let imgTag = `<img src="${fileURL}" alt="uploaded image" id="uploadedImageID">`;
            dropArea.innerHTML = imgTag;

            let newImageURL = convertToASCII(fileURL);
        }
        fileReader.readAsDataURL(file);
    }
    else {
        alert('Not an image file!\nPlease Upload png/jpg/jpeg');
        dropArea.classList.remove('active');
        dragText.textContent = 'Drag & Drop to Upload File';
    }
}


function convertToASCII(fileURL) {

    var imgTag = document.getElementById('uploadedImageID');
    // imgTag.style.height = '675px';
    // imgTag.style.width  = '1200px';

    var myCanvas = document.getElementById('ascii-area');
    var ctx = myCanvas.getContext('2d');

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = fileURL;

    img.onload = function() {
        ctx.drawImage(img, 0,0); // offset at (0,0)
    
        const imageData = ctx.getImageData( 0, 0, myCanvas.width, myCanvas.height );
        const data = imageData.data;

        // luminance index (with a blankspace at the end)
        // 10 level luminance ramp @%#*+=-:. 
        
        // 70 level luminance ramp $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. 
        // let lum = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\\"^`\'. ';

        // let lum = '@%#+=-. ';

        let lum = '@#S%?*+;:,.'
        let tmp = '';
        for(let tmpT = lum.length-1; tmpT >= 0; tmpT--) {
            tmp += lum[tmpT];
        }
        // lum = tmp;
        let lumLength = lum.length;

        var asciiStr = '';

        let Line = '';

        for(let i = 0; i < data.length; i+= 4) {
            var avg = (0.21*data[i] + 0.72*data[i+1] + 0.07*data[i+2]); // using proper grayscale weights
            data[i] = avg;
            data[i+1] = avg;
            data[i+2] = avg;

            for(let tmp = 0; tmp < 5; tmp++) {
                Line += lum[ Math.floor(avg/(256/lumLength)) ];
            }
            
            if(i % (imageData.width*4) == 0) {
                Line += "\n";
                for(let tmp = 0; tmp < 7; tmp++) {
                    asciiStr += Line;
                }

                Line = '';

            }
        }

        let outputPTag = document.getElementById('output');
        outputPTag.innerHTML = asciiStr;
        outputPTag.style.fontSize = '1px';
        console.log(asciiStr);

        ctx.putImageData(imageData,0,0);
    };

    return fileURL;
}


// returns an ImageData object which contains the resized image
// accepts an ImageData object
// For now, it squishes a larger image to have width 600

/*
function resizeImage(imageData) {

    // first resize the width component
    var newData = new Uint8ClampedArray(imageData.height * 600);

    let pos = 0;
    let pos2 = 0;
    var k = Math.ceil(imageData.width / 600);

    console.log("HERE:", k);

    for(let i = 0; i < imageData.height; i++) {
        for(let j = 0; j < imageData.width; j++) {
            let avgR = 0, avgG = 0, avgB = 0, avgA = 0;

            // go through 4 channels RGBA
            for(let t = 0; t < k; t++) {
                avgR += imageData.data[pos];
                avgG += imageData.data[pos+1];
                avgB += imageData.data[pos+2];
                avgA += imageData.data[pos+3];

                pos = pos + 4;
            }

            newData[pos2] = avgR / k;
            newData[pos2 + 1] = avgG / k;
            newData[pos2 + 2] = avgB / k;
            newData[pos2 + 3] = avgA / k;

            pos2 = pos2 + 4;
            
        }
    }

    var newImage = new ImageData(600, imageData.height);
    newImage.data.set(newData);
    // newImage.width.set(600);
    // newImage.height.set(imageData.height);

    return newImage;
}
*/