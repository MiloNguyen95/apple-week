const canvas = document.getElementById("canvas")
const buttons = document.getElementsByTagName("button")
const arrow = document.getElementById("arrow")



for (let i = 0; i < buttons.length; i++) {
    let size = `${window.innerWidth / 50}px`
    buttons[i].style.fontSize = size
}
let containerWidth = window.innerWidth > 375 ? 375 : window.innerWidth


canvas.height = canvas.width = containerWidth * 0.9
arrow.style.top = `${-canvas.width / 15}px`
arrow.style.left = `${canvas.width / 2 - canvas.width / 20}px`
let prize = null;
let duration = 2;
let spins = 3;
let theWheel = new Winwheel({
    'numSegments': 9,
    'outerRadius': containerWidth * 0.4,
    'textFontSize': containerWidth / 30,
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
        alert('Các giá trị của status: 1, 2, 31');
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

async function stopSpin() {
    if (wheelSpinning == false) {
        theWheel.animation = {
            'type': 'spinToStop',
            'duration': (duration + 13),
            'spins': (spins + 1),
            'callbackSound': playSound,
            'soundTrigger': 'pin',
            'callbackFinished': alertPrize,
        };

        const response = await fetch('http://appleweek.ongdev.com/api/v1/count', {
            method: 'GET'
        });
        const countingValues = await response.json()
        let shouldContinue = true;
        let stop = 0;
        while (shouldContinue) {
            stop = Math.floor(Math.random() * (359 - 0)) + 0;

            const prizeIndex = Math.floor(stop / 40);

            switch (prizeIndex) {
                case 0:
                    shouldContinue = parseInt(countingValues["GI50"]) === 0
                    break;
                case 1:
                    shouldContinue = parseInt(countingValues["Bút"]) === 0
                    break;
                case 2:
                    shouldContinue = parseInt(countingValues["Đt10"]) === 0
                    break;
                case 3:
                    shouldContinue = parseInt(countingValues["Sổ"]) === 0
                    break;
                case 4:
                    shouldContinue = parseInt(countingValues["ĐT50"]) === 0
                    break;
                case 5:
                    shouldContinue = parseInt(countingValues["Bong bóng"]) === 0
                    break;
                case 6:
                    shouldContinue = parseInt(countingValues["ĐT20"]) === 0
                    break;
                case 7:
                    shouldContinue = parseInt(countingValues["Quạt"]) === 0
                    break;
                case 8:
                    shouldContinue = parseInt(countingValues["Túi"]) === 0
                    break;
                default:
                    break;
            }
        }

        theWheel.animation.stopAngle = stop;

        theWheel.startAnimation();

        wheelSpinning = true;
    }
}

async function alertPrize(indicatedSegment) {
    const message = indicatedSegment.text;
    switch (message) {
        case 'Voucher GotIt 50K':
        case 'Mã nạp 10K':
        case 'Mã nạp 50K':
        case 'Mã nạp 20K':
            prize = message
            $('#userInfoModal').modal()
            break;
        default:
            await fetch('http://appleweek.ongdev.com/api/v1/count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "prize": message
                })
            });
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
    let formData = new FormData(userInfoForm)
    formData.append('prize', prize)
    try {
        const response = await axios.post('http://appleweek.ongdev.com/api/v1/user', formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
              },
            cache: false
        })
        if (response.status === 500 || response.status === 406) {
            alert("Gửi thông tin không thành công")
        } else {
            alert("Gửi thông tin thành công")
        }
    } catch (error) {
        alert("Gửi thông tin thành công")
    }
}