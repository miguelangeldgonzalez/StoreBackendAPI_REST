const fs = require('fs-extra');
const path = require('path');

async function read (){
    fs.readdir('./routes', (err, files) => {
        console.log(files);
    })
}

read();