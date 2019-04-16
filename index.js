/**
 * @file code uplader [WORK IN PROGRESS]
 */
const request = require('request');
const fs = require('fs');
const chalk = require('chalk');

class UploadPlugin {
    constructor({receiver, to, onUploaded}) {
        this.receiver = receiver;
        this.to = to || '/home/work/orp';
        this.onUploaded = onUploaded;;
        this.info = [];
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('UploadPlugin', async ({assets}) => {
            this.beforeUpload();
            await Promise.all(Object.keys(assets).map(async (key) => {
                const asset = assets[key];
                const result = await this.upload({to: `${this.to}/${key}`, at: asset.existsAt});
                this.info.push({file: key, code: result.body});
            }));
            this.endUpload();
        });
    }

    beforeUpload() {
        this.info.length = 0;
    }

    upload({to, at}) {
        const formData = {
            to,
            file: fs.createReadStream(at)
        };
        return new Promise(resolve => {
            request.post({url: this.receiver, formData}, (err, res, body) => {
                resolve({err, res, body});
            });
        });
    }

    endUpload() {
        if (this.onUploaded) {
            this.onUploaded(this.info);
        } else {
            this.simplePrint();
        }
    }

    simplePrint() {
        console.group(chalk.blue(`upload >>> ${this.to}`));
        for (const info of this.info) {
            const {file, code} = info;
            const done = code === '0';
            console.log(chalk[done ? 'green' : 'red'](`${file} ${done ? '✔︎' : '✘'}`));
        }
        console.groupEnd();
        console.log(chalk.blue('-'.repeat(10)));
    }
}

module.exports = UploadPlugin;