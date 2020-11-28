const canvas = document.getElementById("canvas")
const buttons = document.getElementsByTagName("button")
const arrow = document.getElementById("arrow")
// const userInputForm = document.getElementById("userInfoForm")


for (let i = 0; i < buttons.length; i++) {
    let size = `${window.innerWidth / 50}px`
    buttons[i].style.fontSize = size
    console.log(buttons[i].style)
}
let containerWidth = window.innerWidth > 375 ? 375 : window.innerWidth


canvas.height = canvas.width = containerWidth *0.9
arrow.style.top = `${-canvas.width / 15}px`
arrow.style.left = `${canvas.width / 2 - canvas.width / 20}px`
//Thông số vòng quay
let duration = 2; //Thời gian kết thúc vòng quay
let spins = 3; //Quay nhanh hay chậm 3, 8, 15
let theWheel = new Winwheel({
    'numSegments': 9,     // Chia 8 phần bằng nhau
    'outerRadius': containerWidth * 0.4,   // Đặt bán kính vòng quay
    'textFontSize':containerWidth / 30,    // Đặt kích thước chữ
    'textFontFamily': 'Texturina',
    'rotationAngle': 0,     // Đặt góc vòng quay từ 0 đến 360 độ.
    'segments':        // Các thành phần bao gồm màu sắc và văn bản.
        [
            { 'fillStyle': '#aa0d32', 'text': 'Voucher GotIt 50K', 'textFillStyle': '#ffffff' },
            { 'fillStyle': '#ffffff', 'text': 'Bút' },
            { 'fillStyle': '#ffb347', 'text': 'Mã nạp 10K' },
            { 'fillStyle': '#aa0d32', 'text': 'Sổ tay', 'textFillStyle': '#ffffff' },
            { 'fillStyle': '#ffffff', 'text': 'Mã nạp 50K' },
            { 'fillStyle': '#ffb347', 'text': 'Bong bóng' },
            { 'fillStyle': '#aa0d32', 'text': 'Mã nạp 20K', 'textFillStyle': '#ffffff' },
            { 'fillStyle': '#ffffff', 'text': 'Quạt tay' },
            { 'fillStyle': '#ffb347', 'text': 'Túi vải cao cấp' },
        ],
    'animation': {
        'type': 'spinOngoing', //spinToStop, spinOngoing
        'duration': duration,
        'spins': spins,
        'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
        'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
        'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
    },
    'pins':
    {
        'number': 9   //Số lượng chân. Chia đều xung quanh vòng quay.
    }
});

//Kiểm tra vòng quay
let wheelSpinning = false;

//Tạo âm thanh và tải tập tin tick.mp3.
let audio = new Audio('../assets/audio/tick.mp3');
function playSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

//Hiển thị các nút vòng quay
function statusButton(status) {
    if (status == 1) { //trước khi quay
        document.getElementById('spin_start').classList.remove("hide");
        document.getElementById('spin_reset').classList.add("hide");
    } else if (status == 2) { //đang quay
        document.getElementById('spin_start').classList.add("hide");
        document.getElementById('spin_reset').disabled = true
        document.getElementById('spin_reset').classList.remove("hide");
    } else if (status == 3) { //kết quả
        document.getElementById('spin_start').classList.add("hide");
        document.getElementById('spin_reset').disabled = false
        document.getElementById('spin_reset').classList.remove("hide");
    } else {
        alert('Các giá trị của status: 1, 2, 3');
    }
}
statusButton(1);

//startSpin
function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        //CSS hiển thị button
        statusButton(2);

        //Cấu hình vòng quay
        theWheel.animation = {
            'type': 'spinOngoing',
            'duration': duration,
            'spins': spins,
            'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
            'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
            'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
        };

        //Hàm bắt đầu quay
        theWheel.startAnimation();
        setTimeout(stopSpin, 3000)
    }
}

//stopSpin
function stopSpin() {
    if (wheelSpinning == false) {
        theWheel.animation = {
            'type': 'spinToStop',
            'duration': (duration + 13),
            'spins': (spins + 1),
            'callbackSound': playSound,     //Hàm gọi âm thanh khi quay
            'soundTrigger': 'pin',         //Chỉ định chân là để kích hoạt âm thanh
            'callbackFinished': alertPrize,    //Hàm hiển thị kết quả trúng giải thưởng
        };

        //Kết quả chỉ định
        stopAngle();

        //Hàm bắt đầu quay
        theWheel.startAnimation();

        //Khóa vòng quay
        wheelSpinning = true;
        let stop = Math.floor((Math.random() * 360));
        theWheel.animation.stopAngle = stop;
    }
}

//stopAngle
function stopAngle() {
}

//Result
function alertPrize(indicatedSegment) {
    const message = indicatedSegment.text;
    switch (message) {
        case 'Voucher GotIt 50K':
        case 'Mã nạp 10K':
        case 'Mã nạp 50K':
        case 'Mã nạp 20K':
            $('#userInfoModal').modal()
            break;
        default:
            alert("Chúc mừng bạn trúng: " + indicatedSegment.text);
            break;
    }

    //CSS hiển thị button
    statusButton(3);
}

//resetWheel
function resetWheel() {
    //CSS hiển thị button
    statusButton(1);

    theWheel.stopAnimation(false);
    theWheel.rotationAngle = 0;
    theWheel.draw();

    wheelSpinning = false;
}

userInfoForm.onsubmit = async (e) => {
    e.preventDefault();
    let response = await fetch('https://hb-sap-api.herokuapp.com/api/v1/user', {
        method: 'POST',
        body: new FormData(userInfoForm)
    });

    let result = await response.json();

    alert(result.message);
}