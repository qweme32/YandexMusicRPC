const { ipcRenderer } = require('electron');

const startTime = Date.now();

const handleTrack = () => {
    const track = externalAPI.getCurrentTrack();
    const isPlaying = externalAPI.isPlaying();

    let data = {
        track, 
        isPlaying
    }

    ipcRenderer.send("discord:set", data);
};

window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("log:print", {service: "APP", message: `Web content loaded! (${(Date.now() - startTime) / 1000}s)`});
    externalAPI.on(externalAPI.EVENT_READY, () => {
        ipcRenderer.send("log:print", {service: "YANDEX", message: `API ready! (${(Date.now() - startTime) / 1000}s)`});
        ipcRenderer.send("discord:connect");
    });

    externalAPI.on(externalAPI.EVENT_TRACK, handleTrack);
    externalAPI.on(externalAPI.EVENT_STATE, handleTrack);
});