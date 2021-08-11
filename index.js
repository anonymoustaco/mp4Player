'use strict';
const path = require('path');
const {dialog, app, BrowserWindow, Menu, ipcMain} = require('electron');
const ipc = ipcMain
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
unhandled();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.thomas.mp4');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 1920,
		height: 1080,
		webPreferences : {
			contextIsolation : false,
			nodeIntegration : true
		},
		icon : "./build/icon.png"
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'index.html'));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}
ipc.on('reload', () => {
	mainWindow.reload()
	console.log('recived')
})
ipc.on('open-file', (event, arg) => {
	console.log('recived')
	const options = {
		"title" : "Open your mp4",
		filters: [
			{ name: 'mp4', extensions: ['mp4'] }
		  ]
	}
	dialog.showOpenDialog(null, options).then((arg) => {
		console.log(arg)
		event.sender.send('path', (event, arg))
	}) 
})
app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	//Menu.setApplicationMenu(Menu.buildFromTemplate([]));
	mainWindow = await createMainWindow();
})();