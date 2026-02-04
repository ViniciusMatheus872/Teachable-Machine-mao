const URL = "https://teachablemachine.withgoogle.com/models/8bnH2h79I/";

let model, webcam;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container")
        .appendChild(webcam.canvas);

    document.getElementById("status").innerText =
        "Modelo carregado!";
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    const class1 = prediction.find(p => p.className === "Class 1");
    const class2 = prediction.find(p => p.className === "Class 2");

    if (class1 && class1.probability > 0.7) {
        document.getElementById("status").innerText =
            "🖐️ Class 1 detectada — Ação liberada";
        document.body.style.backgroundColor = "#ccffcc";
    } 
    else if (class2 && class2.probability > 0.7) {
        document.getElementById("status").innerText =
            "✊ Class 2 detectada — Ação bloqueada";
        document.body.style.backgroundColor = "#ffcccc";
    }
}