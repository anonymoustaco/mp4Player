const electron = require('electron')
const ipc = electron.ipcRenderer
function events () {
    document.getElementById("open").addEventListener('click', () => {
        ipc.send('open-file')
    })
    ipc.on('path', (event, arg) => {
        console.log(arg)
        if(!(arg.canceled)) {
            document.getElementById('container').innerHTML = '<link rel="stylesheet" href="index.css" /><title>Mp4 Player</title><video controls="controls" src="' + arg.filePaths[0] + '" width="100%" height="100%"></video><button id="reload">Select Another Video</button>'
            document.getElementById('reload').addEventListener('click', () => {
                console.log('clicked')
                ipc.send('reload', null)
            })
        }
    })
}
events()