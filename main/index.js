const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const homedir = require("os").homedir()
const path = require('path')
//const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')

const wallets = [];

app.whenReady().then(async () => {
    await prepareNext('./renderer')
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    const menu = Menu.buildFromTemplate([{
        label: "File",
        submenu: [
            {label: "New/Restore"},
            {type: "separator"},
            {role: "quit"},
        ]
    }, {
        label: "Wallet",
        submenu: [
            {label: "Information"},
            {type: "separator"},
            {label: "Seed"},
        ]
    }, {
        label: "View",
        submenu: [
            {label: "Show Addresses"},
            {label: "Show Coins"},
        ]
    }, {
        label: "Tools",
        submenu: [
            {label: "Preferences"},
            {label: "Network"},
        ]
    }, {
        label: "Help",
        submenu: [
            {label: "About"},
        ]
    }])

    Menu.setApplicationMenu(null)

    // open app on screen where cursor is
    const { screen } = require("electron")
    const { getCursorScreenPoint, getDisplayNearestPoint } = screen
    const currentScreen = getDisplayNearestPoint(getCursorScreenPoint())
    const currentScreenXValue = currentScreen.bounds.x
    const boundsObject = { x: currentScreenXValue + 200, y: 200, width: 800, height: 600 }
    win.setBounds(boundsObject)

    await win.loadURL("http://localhost:8000")
    /*if (isDev) {
        win.webContents.openDevTools({mode: 'detach'});
    }*/

    // console.log(win.webContents)

    ipcMain.on("open-dialog", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(win, { defaultPath: homedir + "/.memo/wallets" })
        if(!canceled) {
            win.webContents.send("listenFile", filePaths[0])
        }
    })

    ipcMain.on("store-wallet", (event, walletInfo) => wallets.push(walletInfo))

    ipcMain.on("get-wallet", () => {
        win.webContents.send("added-wallet", wallets[0])
    })

    ipcMain.on("wallet-loaded", () => {
        Menu.setApplicationMenu(menu)
    })
})
