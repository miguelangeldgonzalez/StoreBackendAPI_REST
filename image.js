const fs = require('fs-extra');
const path = require('path');

async function read (){
const exist = await fs.pathExists(path.resolve(`./package${/+/}`));
    console.log(exist);
}

read();