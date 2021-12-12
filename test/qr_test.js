const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");

const dummy = async () => {
    const buffer = await new AwesomeQR({
        text: "AwesomeQR by Makito - Awesome, right now.",
        size: 300,
    }).draw();

    fs.writeFileSync("qrcode.png", buffer);
}

dummy()
