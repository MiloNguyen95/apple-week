const canvas = document.getElementById("canvas")
const buttons = document.getElementsByTagName("button")
const arrow = document.getElementById("arrow")


for (let i = 0; i < buttons.length; i++) {
    let size = `${window.innerWidth / 50}px`
    buttons[i].style.fontSize = size
}
let containerWidth = window.innerWidth > 375 ? 375 : window.innerWidth


canvas.height = canvas.width = containerWidth *0.9
arrow.style.top = `${-canvas.width / 15}px`
arrow.style.left = `${canvas.width / 2 - canvas.width / 20}px`

let duration = 2;
let spins = 3;
let theWheel = new Winwheel({
    'numSegments': 9,
    'outerRadius': containerWidth * 0.4,
    'textFontSize':containerWidth / 30,
    'textFontFamily': 'Texturina',
    'rotationAngle': 0,
    'segments':
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
        'type': 'spinOngoing',
        'duration': duration,
        'spins': spins,
        'callbackSound': playSound,
        'soundTrigger': 'pin',
        'callbackFinished': alertPrize,
    },
    'pins':
    {
        'number': 9
    }
});

let wheelSpinning = false;

let audio = new Audio('../assets/audio/tick.mp3');
function playSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function statusButton(status) {
    if (status == 1) {
        document.getElementById('spin_start').classList.remove("hide");
        document.getElementById('spin_reset').classList.add("hide");
    } else if (status == 2) {
        document.getElementById('spin_start').classList.add("hide");
        document.getElementById('spin_reset').disabled = true
        document.getElementById('spin_reset').classList.remove("hide");
    } else if (status == 3) {
        document.getElementById('spin_start').classList.add("hide");
        document.getElementById('spin_reset').disabled = false
        document.getElementById('spin_reset').classList.remove("hide");
    } else {
        alert('Các giá trị của status: 1, 2, 3');
    }
}
statusButton(1);

function startSpin() {
    if (wheelSpinning == false) {
        statusButton(2);

        theWheel.animation = {
            'type': 'spinOngoing',
            'duration': duration,
            'spins': spins,
            'callbackSound': playSound,
            'soundTrigger': 'pin',
            'callbackFinished': alertPrize,
        };

        theWheel.startAnimation();
        setTimeout(stopSpin, 3000)
    }
}

function stopSpin() {
    if (wheelSpinning == false) {
        theWheel.animation = {
            'type': 'spinToStop',
            'duration': (duration + 13),
            'spins': (spins + 1),
            'callbackSound': playSound,
            'soundTrigger': 'pin',
            'callbackFinished': alertPrize,
        };

        theWheel.startAnimation();

        wheelSpinning = true;
        let stop = Math.floor((Math.random() * 360));
        theWheel.animation.stopAngle = stop;
    }
}

function alertPrize(indicatedSegment) {
    const message = indicatedSegment.text;
    switch (message) {
        case 'Voucher GotIt 50K':
        case 'Mã nạp 10K':
        case 'Mã nạp 50K':
        case 'Mã nạp 20K':
            $('#userInfoModal').modal()
            break;
    }
    alert("Chúc mừng bạn trúng: " + indicatedSegment.text);

    statusButton(3);
}

function resetWheel() {

    statusButton(1);

    theWheel.stopAnimation(false);
    theWheel.rotationAngle = 0;
    theWheel.draw();

    wheelSpinning = false;
}

userInfoForm.onsubmit = async (e) => {
    e.preventDefault();

    $('#userInfoModal').modal('hide')
    resetWheel()
    let response = await fetch('https://hb-sap-api.herokuapp.com/api/v1/user', {
        method: 'POST',
        body: new FormData(userInfoForm)
    });

    let result = await response.json();

    alert(result.message);
}