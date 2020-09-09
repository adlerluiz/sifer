const utils = require('./utils')
const Spinner = require('cli-spinner').Spinner;

const composer = require('./managers/composer')
const dart = require('./managers/dart')
const node = require('./managers/node')

class Pkgi {
    /**
     * Scan given path and return array of files founded
     * @param {String} path 
     * @returns {Array} Array of files
     */
    async scan(path) {
        let files = []

        if (this.isFile(path)) {
            files.push(path)
        } else {
            for (const file of utils.readDir(path)) {
                let joinedPath = utils.pathJoin(path, file)
                if (_getLoader(joinedPath)) files.push(joinedPath)
            }
        }

        return files;
    }

    /**
     * Read file by path
     * @param {String} path 
     * @returns {Object} File object
     */
    async readFile(path) {
        let spinner = new Spinner(`>> Scanning '${path}' %s`);
        let fileContent;
        let loader = _getLoader(path)

        if (loader) {
            spinner.start();
            fileContent = await loader.manager.getContent(
                loader.parser(
                    utils.readFile(path)
                )
            )
            spinner.stop();
        }

        loader.path = path
        return { info: loader, content: fileContent };
    }

    isFile(path) {
        return utils.isFile(path)
    }

    update(file, argv) {
        let type = ['patch'];
        if (!!argv.minor) {
            type.push('minor')
        }
        if (!!argv.major) {
            type.push('major')
        }

        file = _filterToUpdate(file, type)
        let fileDir = utils.getFileDir(file.info.path)

        file.content
            .forEach(
                pkg => {
                    process.chdir(fileDir)
                    console.log(utils.urlReplace(file.info.manager._commands.install, { package: pkg.name, version: pkg.update.version }))
                    utils.exec(utils.urlReplace(file.info.manager._commands.install, { package: pkg.name, version: pkg.update.version }))
                }
            )
    }

}

function _getLoader(path) {
    if (path.includes(composer.defaults.file)) return { manager: composer, parser: utils.toJson }
    if (path.includes(node.defaults.file)) return { manager: node, parser: utils.toJson }
    if (path.includes(dart.defaults.file)) return { manager: dart, parser: utils.toYaml }

    return false;
}

function _filterToUpdate(file, incrementType) {
    var toUpdate = [];

    Object.values(file.content)
        .forEach(
            (dependencies) => {
                Object.values(dependencies)
                    .forEach(
                        pkg => { if (pkg.update.status == 2 && incrementType.includes(pkg.version.incrementType)) toUpdate.push(pkg) }
                    )
            }
        )

    file.content = toUpdate
    return file
}

module.exports = new Pkgi()