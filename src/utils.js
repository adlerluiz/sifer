const fs = require('fs')
const { execSync } = require('child_process');
const path = require('path')
const https = require('https')
const YAML = require('yaml');

class Utils {
    isFile(path) {
        if (fs.existsSync(path)) return fs.lstatSync(path).isFile()
        return false
    }

    readDir(path) {
        if (fs.existsSync(path)) return fs.readdirSync(path)
        throw `Dir ${path} not found`
    }

    readFile(path) {
        if (fs.existsSync(path)) return fs.readFileSync(path, 'utf-8')
        throw `File ${path} not found`
    }

    pathJoin(...paths) {
        return path.join(...paths)
    }

    getFileDir(file) {
        file = file.split('\\')
        if (file.length == 1 || (file[0] == '.' || file[0] == '.\\')) { file.unshift(process.cwd()) }
        file.pop()
        return file.join('\\')
    }

    exec(cmd) {
        return execSync(cmd)
    }

    readHttps(url) {
        try {
            let body = []

            return new Promise(
                (resolve, reject) => {
                    https.get(url, (res) => {
                        let isJson = res.headers['content-type'].includes('json')
                        if (res.statusCode == 200 && isJson) {
                            res
                                .on('data', (chunk) => {
                                    body.push(chunk)
                                })
                                .on('end', () => {
                                    body = Buffer.concat(body).toString()
                                    resolve(body)
                                })
                                .on('error', (e) => {
                                    reject(e);
                                })
                        } else {
                            resolve({})
                        }
                    })
                }
            )
        } catch (e) {
            console.log('error')
        }
    }

    urlReplace(url, objReplaceWith) {
        let keys = Object.keys(objReplaceWith);
        let urlReturn = url;

        keys.forEach(
            key => {
                urlReturn = urlReturn.replace(`:${key}`, objReplaceWith[key]);
            }
        )

        return urlReturn;
    }

    toJson(string) {
        return JSON.parse(string)
    }

    fromJson(json) {
        return JSON.stringify(json)
    }

    toYaml(string) {
        return YAML.parse(string)
    }

    fromYaml(yaml) {
        return YAML.stringify(yaml)
    }

}

module.exports = new Utils();