const {validateLinks, linkStats, validateStats } = require('./main.js');

const fs = require('fs');
const marked = require('marked');
const path = require('path');
//const colors = require('colors');

let index = process.argv.indexOf("--file");
let flags = process.argv;

function readFile(uri) { 
    if (fs.existsSync(uri)){
        let fileContent = fs.readFileSync(uri, 'utf8');
        return fileContent;
    } else {
        console.log('El archivo'.red, uri.red.bgCyan, 'NO existe'.red);
        return false;
    };
};

function getUri() {
    let uri = process.argv[index + 1];
    let ext = path.extname(uri);
        if (index < 0) {
             console.log('Poner'.red, '--file'.red.bgCyan, '(--file Nombre_Archivo.md)'.red);
             return false;
        } else if (ext != '.md') {
             console.log('Archivo invalido!'.red + '\nDebe ser un archivo '.red + 'Markdown (.md)'.red.bgCyan);

             return false;
        } else {
            return uri;
        }
}

function getLinks(content){
    let renderer = new marked.Renderer();
    let arrayLinks = [];
    renderer.link = ( href, file, text ) =>{
        arrayLinks.push({
            href: href,
            title: text.slice(0, 50),
            path: file
        })
    }
    marked(content, { renderer: renderer });
    return arrayLinks;
}

async function validate(){
    let uri = getUri();
        if(uri != false) {
            let content = readFile(uri);
            if(content != false){
                let arrayLinks = getLinks(content);
                if (arrayLinks.length <= 0) return console.log('El archivo', uri.cyan, 'no tiene links!');
                if (flags.includes('--validate') && flags.includes('--stats') || flags.includes('--v') && flags.includes('--s')) {
                    validateStats(arrayLinks, uri);
                } else if (flags.includes('--validate') || flags.includes('--v')){
                    validateLinks(arrayLinks, uri);
                } else if (flags.includes ('--stats') || flags.includes('--s')){
                    linkStats(arrayLinks, uri); 
                } else {
                if(arrayLinks != '') {
                console.log('Los Links del Archivo '.blue + uri.green.bold.italic  + ' son: \n'.blue)
                }

                arrayLinks.forEach(link => {
                    console.log('   ⋆ '.magenta + link.href.blue + '  ' + link.title.magenta);
                });
              };     
            };
    };
};

validate()
module.exports = { getUri, getLinks, linkStats, validate };