// YandexMusicRPC
// by @qweme32

const { app, BrowserWindow, ipcMain } = require('electron');
const Discord = require("discord-rpc");
const path = require('path');

let clientIsReady = false;
let startTime = Date.now();
let clientTime = startTime;

const clientId = "1042597714111762432";
const client = new Discord.Client({ transport: 'ipc' });

app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy');

if (require('electron-squirrel-startup')) return;
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        title: "Yandex.Music",
        show: false,
        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            contextIsolation: false,
        }
    });

    win.webContents.insertCSS(`
        ::-webkit-scrollbar {
            display: none;
        }
        .notify{
            display: none;
        }
    `);

    win.loadURL('https://music.yandex.ru/home');
    win.webContents.on("page-title-updated", () => { win.title = "Yandex.Music" });
    win.once("ready-to-show", win.show);
};

let logPrint = (data) => {
    console.log(`[${data.service}] ${data.message}`);
}

ipcMain.on("log:print", (event, data) => {
    logPrint(data);
});

ipcMain.on("discord:connect", () => {
    logPrint({ service: "DISCORD", message: "Connecting..." });
    clientTime = Date.now();
    client.login({ clientId });
});

ipcMain.on("discord:set", (event, data) => {
    if (!clientIsReady) return;

    if (data.isPlaying) {
        client.setActivity({
            details: data.track.title,
            state: data.track.artists.map(a => a.title).join(", "),
            largeImageKey: 'https://' + data.track.cover.replace("%%", "200x200"),
            largeImageText: data.track.album.title,
        });
    } else {
        client.clearActivity();
    }
});

client.on("ready", () => {
    clientIsReady = true;
    logPrint({ service: "DISCORD", message: `Ready! (${(Date.now() - clientTime) / 1000}s)` });
    logPrint({ service: "DISCORD", message: `Hello, ${client.user.username}#${client.user.discriminator}` });
    logPrint({ service: "APP", message: `Init finished. (${(Date.now() - startTime) / 1000}s)` });
});

client.on("disconnected", () => {
    clientIsReady = false;
    logPrint({ service: "DISCORD", message: `Disconnected.` });
});


app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', app.quit);



function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};