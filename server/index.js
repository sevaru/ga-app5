import * as fs from 'fs';
import {BrowserGA, NodeGA} from '../app/plugins/GA/lib/ga/GA';
import MusicContext from '../app/plugins/GA/lib/MusicContext';
import options from './options';

const reference = MusicContext.getCurrentComposition();

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}

/**
 * @param {string} fileName
 * @param {string} content
 * @returns {Promise}
 */
function writeFile(fileName, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, content, (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        })
    })
}

function fileWriter(fileName) {
    let content = '';
    return {
        writeLine: data => {
            content += `${data}\n`;
        },
        save: () => writeFile(fileName, content)
    }
}

const writer = fileWriter('./server/Experiment_' + Date.now() + '.csv');

const browserExp = () => {
    return new Promise((resolve) => {
        const start = clock();
        new BrowserGA(options, {
            onProgress: ({ best }) => {
                console.log('Browser best', best.fitness.value);
            },
            onDone: (_e) => {
                writer.writeLine(`Browser done; ${clock(start)};`);
                resolve();
            }
        }, reference);
    });
}

const nodeExp = (rate) => {
    return new Promise((resolve) => {
        const start = clock();
        new NodeGA(options, {
            onProgress: ({ best }) => {
                console.log('Node best', best.fitness.value);
            },
            onDone: (_e) => {
                writer.writeLine(`Node done; ${clock(start)};`);
                resolve();
            }
        }, reference, rate);
    });
};

const ITERATIONS = process.argv[2] && +(process.argv[2]).replace('--iter=', '') || 10;
console.log(ITERATIONS);

async function foo() {
    let count = 0;
    while(count++ < ITERATIONS) {
        console.log('Iteration: ' + count);
        await browserExp();
        await nodeExp();
    }
    console.log('Done');
    writer.save();
}

foo();

// TODO
/*
1) create program (npm i commander) pass config + runner config (processes, etc)
2) create node-runner (with communication via stdout.on('data')) //http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
http://stackoverflow.com/questions/10773564/which-would-be-better-for-concurrent-tasks-on-node-js-fibers-web-workers-or-t
3) tie together!
http://stackoverflow.com/questions/10773564/which-would-be-better-for-concurrent-tasks-on-node-js-fibers-web-workers-or-t
4) UI for results (play, view)
5) generate audio?
*/