const Managers = require('./managers')

const _DEFAULTS = {
    file: 'pubspec.yaml',
    language: 'dart',
    manager: 'pub',
    parser: 'yaml',
    registry: 'https://pub.dev/api/packages/:package',
    commands: {
        install: 'flutter pub get'
    }
}

class Dart extends Managers {
    constructor() {
        super(_DEFAULTS)
    }

    get defaults() {
        return _DEFAULTS
    }

    async getContent(content) {
        try {
            let dependencies = await this._getDependencies(content['dependencies'])
            let devDependencies = await this._getDependencies(content['dev_dependencies'])

            return {
                "Dependencies": dependencies,
                "Dev Dependencies": devDependencies
            }
        } catch (e) {
            console.log('No content for DART: ' + e)
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
        if (data['versions']) {
            return Object.values(data['versions'].map((data) => data.version))
        }
        return []
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

module.exports = new Dart()