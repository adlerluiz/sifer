const utils = require('./utils')
const Spinner = require('cli-spinner').Spinner;

const composer = require('./managers/composer')
const flutter = require('./managers/flutter')
const npm = require('./managers/npm')
const pub = require('./managers/pub')
const yarn = require('./managers/yarn')

class Sifer {
    /**
     * Scan given path and return array of files founded
     * @param {String} path 
     * @returns {Array} Array of files
     */
    async scan(path, argv) {
        let files = []

        if (this.isFile(path)) {
            files.push(path)
        } else {
            for (const file of utils.readDir(path)) {
                let joinedPath = utils.pathJoin(path, file)
                if (_getLoader(joinedPath, argv.use)) files.push(joinedPath)
            }
        }

        return files;
    }

    /**
     * Read file by path
     * @param {String} path 
     * @returns {Object} File object
     */
    async readFile(path, argv) {
        let spinner = new Spinner(`>> Scanning '${path}' %s`);
        let fileContent;
        let loader = _getLoader(path, argv.use)

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

        let filesFiltered = _filterToUpdate(file, type)
        let fileDir = utils.getFileDir(filesFiltered.info.path)
        let fileContent = utils.readFile(file.info.path)
        let replace = filesFiltered.info.manager._replace

        let spinner = new Spinner(`>> Updating '${filesFiltered.info.path}' %s`);
        spinner.start()
        console.log('\n')

        filesFiltered.content
            .forEach(
                pkg => {
                    fileContent = fileContent.replace(
                        utils.replace(replace.old, { name: pkg.name, version: pkg.version.current }),
                        utils.replace(replace.new, { name: pkg.name, incrementType: _getIncrementType(pkg.version.incrementType), version: pkg.update.version })
                    )
                    console.log(`>> ${pkg.name} ${pkg.version.current} => ${pkg.update.version}`)
                    // console.log(utils.replace(replace.new, { name: pkg.name, incrementType: _getIncrementType(pkg.version.incrementType), version: pkg.update.version }))
                }
            )
        utils.writeFile(filesFiltered.info.path, fileContent)

        process.chdir(fileDir)
        spinner.stop()
        console.log(`\n>> ${file.info.manager._cmd}`)
        utils.exec(file.info.manager._cmd)
    }
}

function _getLoader(path, use) {
    if (path.includes(composer.defaults.file)) {
        return { manager: composer, parser: utils.toJson }
    }

    if (path.includes(npm.defaults.file)) {
        if (use == 'yarn') {
            return { manager: yarn, parser: utils.toJson }
        }
        // Default is npm
        return { manager: npm, parser: utils.toJson }
    }

    if (path.includes(pub.defaults.file)) {
        if (use == 'flutter') {
            return { manager: flutter, parser: utils.toYaml }
        }
        // Default is pub
        return { manager: pub, parser: utils.toYaml }
    }

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

function _getIncrementType(incrementType) {
    switch (incrementType) {
        case 'patch':
            return '~'
        case 'minor':
            return '^'
        default:
            return ''
    }
}

module.exports = new Sifer()