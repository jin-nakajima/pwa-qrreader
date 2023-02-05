const video = document.createElement('video');
const startScanBtn = document.getElementById('start-scan');
const output = document.querySelector('#output');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// QRコードをスキャンする関数
function scanQRCode(){
  // canvas要素を作成
  if(video.readyState === video.HAVE_ENOUGH_DATA){
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let qrcode = jsQR(img.data, img.width, img.height, {inversionAttempts: "dontInvert"});
    if(qrcode){
        //drawRect(qrcode.location);
        //output.innerText = qrcode.data;
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.right = 0;
        modal.style.bottom = 0;
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `<a href="${qrCode.data}" target="_blank">${qrCode.data}</a>`;
        document.body.appendChild(modal);
    }else{
        output.innerText = "QRコード読み取り中"
    }
}
setTimeout(scanQRCode, 250);
};

// カメラ起動
const userMedia = {video: {facingMode: "environment"}};
startScanBtn.addEventListener('click', () => {
  navigator.mediaDevices
  .getUserMedia(userMedia)
  .then(stream => {
    video.srcObject = stream;
    video.setAttribute('playsinline', true);
    video.play();
    scanQRCode();
  })
  .catch(err => {
    console.error(err);
  });
});


function drawRect(location){
    drawLine(location.topLeftCorner,     location.topRightCorner);
    drawLine(location.topRightCorner,    location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner,  location.topLeftCorner);
}

function drawLine(begin, end){
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FF3B58";
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}
