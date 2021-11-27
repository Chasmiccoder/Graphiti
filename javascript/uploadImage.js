// Select required elements
const dropArea = document.querySelector('.drag-area');
const dragText = dropArea.querySelector("header");
const button = dropArea.querySelector('button'); 
const input = dropArea.querySelector('input');

// const asciiArea = document.querySelector('.ascii-area');

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
    // console.log('File is over Drop Area');

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

    // console.log(file);
    // console.log(fileType);
    
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    if(validExtensions.includes(fileType)) {
        console.log('Valid File!');
        let fileReader = new FileReader(); // converts the image to a data url
        fileReader.onload = ()=> {
            let fileURL = fileReader.result;
            // console.log(fileURL); // we get the image in base64 format [might need this later!]
            let imgTag = `<img src="${fileURL}" alt="uploaded image" id="uploadedImageID">`;
            dropArea.innerHTML = imgTag;
            
            let newImageURL = convertToASCII(fileURL);
            // let asciiImage = `<img src="${newImageURL}" alt="ascii image">`;
            // asciiArea.innerHTML = asciiImage;
        }
        fileReader.readAsDataURL(file);
    }
    else {
        alert('Not an image file!\nPlease Upload png/jpg/jpeg');
        dropArea.classList.remove('active');
        dragText.textContent = 'Drag & Drop to Upload File';
    }

}


//////////////////
//


function convertToASCII(fileURL) {

    // let img = new Image;
    // img.src = fileURL;

    var imgTag = document.getElementById('uploadedImageID');
    // imgTag.style.height = '640px';
    // imgTag.style.width  = '480px';

    var myCanvas = document.getElementById('ascii-area');
    var ctx = myCanvas.getContext('2d');

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = fileURL;

    // var target = new Image(); ///////////

    
    
    img.onload = function() {
        ctx.drawImage(img, 0,0); // offset at (0,0)
    

        // ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0,0,myCanvas.width,myCanvas.height );
        const data = imageData.data;

        // var data = imageData.data;

        // console.log("Without new lines, data len: ", data.length);

        // implement resize
        var newImage = new Uint8ClampedArray(data.length);
        
        for(let i = 0; i < data.length; i+= 4) {
            var avg = (0.21*data[i] + 0.72*data[i+1] + 0.07*data[i+2]); // using proper grayscale weights
            // data[i] = avg;
            // data[i+1] = avg;
            // data[i+2] = avg;

            // newImage.push(avg);
            // newImage.push(avg);
            // newImage.push(avg);
            newImage[i] = avg;
            newImage[i+1] = avg;
            newImage[i+2] = avg;
            newImage[i+3] = data[i+3];
        }

        

        // luminance index (with a blankspace at the end)
        // 10 level luminance ramp @%#*+=-:. 
        // 70 level luminance ramp $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. 


        let lum = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\\"^`\'. ';

        // let lum = '@%#*+=-:. ';
        // let lumLength = lum.length;

        // for(let i = 0; i < data.length; i+=4) {
        //     let lumIndex = Math.floor(data[i]/255)*lumLength;
        //     
        // }



        
        console.log("HERE:",data.stringify === newImage.stringify);
        // imageData.data = newImage;
        imageData.data.set(newImage);
        // data = newImage;
        ctx.putImageData(imageData,0,0);
    
    
    };


    return fileURL;
}

