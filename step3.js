const fs = require('fs');
const process = require('process');
const axios = require('axios');

function handleOutput(outputData, outputFile) {
    if (outputFile) {
        fs.writeFile(outputFile, outputData, 'utf8', (err) => {
            if (err) {
                console.error(`Couldn't write ${outputFile}:\n  ${err}`);
                process.exit(1);
            }
        });
    } else {
        console.log(outputData);
    }
}

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading ${path}:\n  ${err}`);
            process.kill(1)
        } else {
            handleOutput(data, outputFile);
        }
    });
}

async function webCat(url) {
    try {
        const resp = await axios.get(url);
        console.log(resp.data);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err}`);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
let outputFile = null;
let path;

if (args[0] === '--out') {
    outputFile = args[1];
    path = args[2];
} else {
    path = args[0];
}


if (path.startsWith('http')) {
    webCat(path, outputFile);
} else {
    cat(path, outputFile);
}