const Managers = require('./managers')

const _DEFAULTS = {
    file: 'pubspec.yaml',
    lock: 'pubspec.lock',
    language: 'dart',
    manager: 'pub',
    parser: 'yaml',
    registry: 'https://pub.dev/api/packages/:package',
    search: ['dependencies', 'dev_dependencies'],
    replace: {
        old: ':name: :version',
        new: ':name: :incrementType:version'
    },
    cmd: "flutter pub get"
}

class Flutter extends Managers {
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
            console.log('No content for PUB: ' + e)
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

module.exports = new Flutter()