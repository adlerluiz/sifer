const Managers = require('./managers')

const _DEFAULTS = {
    file: 'package.json',
    lock: 'package-lock.json',
    language: 'js',
    manager: 'npm',
    parser: 'json',
    registry: 'https://registry.npmjs.org/:package',
    search: ['dependencies', 'devDependencies', 'optionalDependencies'],
    replace: {
        old: '":name": ":version"',
        new: '":name": ":incrementType:version"'
    },
    cmd: "npm install"
}

class Npm extends Managers {
    constructor() {
        super(_DEFAULTS)
    }

    get defaults() {
        return _DEFAULTS
    }

    async getContent(content) {
        try {
            let result = {}

            for (const dependencie of _DEFAULTS.search) {
                result[dependencie] = await this._getDependencies(content[dependencie])
            }

            return result
        } catch (e) {
            console.log('No content for NPM: ' + e)
        }
    }

    async _getDependencies(dependencies) {
        return super._getDependencies(dependencies)
    }

    async _getDetails(packageName, version) {
        return super._getDetails(packageName, version)
    }

    _getPackageData(packageName) {
        return super._getPackageData(packageName)
    }

    _getPackageDataVersions(data) {
        return super._getPackageDataVersions(data)
    }

    _checkIncrementType(version) {
        return super._checkIncrementType(version)
    }

    _getAvailableByIncrementType(releases, currentVersion, incrementType) {
        return super._getAvailableByIncrementType(releases, currentVersion, incrementType)
    }

    printTable(title, dependencies) {
        super.printTable(title, dependencies)
    }
}

module.exports = new Npm()