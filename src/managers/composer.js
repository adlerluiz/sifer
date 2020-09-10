const Managers = require('./managers')

const _DEFAULTS = {
    file: 'composer.json',
    lock: 'composer.lock',
    language: 'php',
    manager: 'composer',
    parser: 'json',
    registry: 'https://packagist.org/packages/:package.json',
    search: ['require', 'require-dev'],
    replace: {
        old: '":name": ":version"',
        new: '":name": ":incrementType:version"'
    },
    cmd: "php composer install"
}

class Composer extends Managers {
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
            console.log('No content for COMPOSER: ' + e)
        }
    }

    async _getDependencies(dependencies) {
        const semver = require('semver')
        let result = [];

        if (dependencies) {
            for (const [packageName, version] of Object.entries(dependencies)) {
                let coerceVersion = semver.valid(semver.coerce(version))
                let hasVendor = packageName.includes('/')

                if (coerceVersion && hasVendor) {
                    //console.log(`Geting info about ${packageName}...`)
                    result.push(await this._getDetails(packageName, version))
                }

                //console.clear()
            }
        }
        return result;
    }

    async _getDetails(packageName, version) {
        return super._getDetails(packageName, version)
    }

    _getPackageData(packageName) {
        return super._getPackageData(packageName)
    }

    _getPackageDataVersions(data) {
        if (data['package']['versions']) {
            return Object.keys(data['package']['versions'])
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

module.exports = new Composer()