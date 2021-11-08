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
            let imgTag = `<img src="${fileURL}" alt="uploaded image">`;
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
// Uploading image to canvas without any manipulation




function convertToASCII(fileURL) {

    // let img = new Image;
    // img.src = fileURL;

    var myCanvas = document.getElementById('ascii-area');
    var ctx = myCanvas.getContext('2d');

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = fileURL;

    img.onload = function() {
        ctx.drawImage(img, 0,0); // offset at (0,0)
    

        // ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0,0,myCanvas.width,myCanvas.height );
        const data = imageData.data;

        for(let i = 0; i < data.length; i+= 4) {
            var avg = (data[i] + data[i+1] + data[i+2]) / 3; // later on, use proper grayscale weights
            data[i] = avg;
            data[i+1] = avg;
            data[i+2] = avg;
        }
        ctx.putImageData(imageData,0,0);
    
    
    };






    return fileURL;
}



