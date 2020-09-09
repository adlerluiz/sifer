const Managers = require('./managers')

const _DEFAULTS = {
    file: 'package.json',
    language: 'js',
    manager: 'npm',
    parser: 'json',
    registry: 'https://registry.npmjs.org/:package',
    commands: {
        install: 'npm install :package@:version'
    }
}

class Node extends Managers {
    constructor() {
        super(_DEFAULTS)
    }

    get defaults() {
        return _DEFAULTS
    }

    async getContent(content) {
        try {
            let dependencies = await this._getDependencies(content['dependencies'])
            let devDependencies = await this._getDependencies(content['devDependencies'])
            let optionalDependencies = await this._getDependencies(content['optionalDependencies'])

            return {
                "Dependencies": dependencies,
                "Dev Dependencies": devDependencies,
                "Optional Dependencies": optionalDependencies,
            }
        } catch (e) {
            console.log('No content for NODE: ' + e)
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

module.exports = new Node()