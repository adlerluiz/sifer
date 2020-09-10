const utils = require('../utils')
const semver = require('semver')

const _pattSemver = /(\d+)\.(\d+)\.(\d+)-?([a-zA-Z-\d\.]*)\+?([a-zA-Z-\d\.]*)/

const _INCREMENT_TYPE = {
    PATCH: 'patch',
    MINOR: 'minor',
    MAJOR: 'major'
}

const _UPDATE_STATUS = {
    UNDEFINED: 0,
    SAME: 1,
    AVAILABLE: 2
}

module.exports = class Managers {
    constructor(defaults) {
        this._file = defaults.file
        this._lock = defaults.lock
        this._manager = defaults.manager
        this._parser = defaults.parser
        this._registry = defaults.registry
        this._search = defaults.search
        this._commands = defaults.commands
        this._replace = defaults.replace
        this._cmd = defaults.cmd
    }

    async _getDependencies(dependencies) {
        let result = [];

        if (dependencies) {
            for (const [packageName, version] of Object.entries(dependencies)) {
                let coerceVersion = semver.valid(semver.coerce(version))
                if (coerceVersion) {
                    // console.log(`Geting info about ${packageName}...`)
                    result.push(await this._getDetails(packageName, version))
                }
                // console.clear()
            }
        }
        return result;
    }

    async _getDetails(packageName, version) {
        let packageData = await this._getPackageData(packageName)

        if (Object.keys(packageData).length) {
            packageData = utils.toJson(packageData)

            let releases = this._getPackageDataVersions(packageData)

            let raw = semver.valid(semver.coerce(version))
            let incrementType = this._checkIncrementType(version)
            let update = this._getAvailableByIncrementType(releases, raw, incrementType)

            return {
                name: packageName,
                version: {
                    current: version,
                    raw: raw,
                    incrementType: incrementType,
                },
                update: update
            }
        }

        return {}
    }

    _getPackageData(packageName) {
        let url = utils.replace(this._registry, { package: packageName })

        return new Promise(
            (resolve, _) => {
                utils.readHttps(url)
                    .then(details => {
                        if (details) {
                            resolve(details)
                        } else {
                            resolve([])
                        }
                    })
            }
        )
    }

    _getPackageDataVersions(data) {
        if (data['versions']) {
            return Object.keys(data['versions'])
        }
        return []
    }

    _checkIncrementType(version) {
        if (version.includes('~')) return _INCREMENT_TYPE.PATCH
        if (version.includes('^')) return _INCREMENT_TYPE.MINOR
        return _INCREMENT_TYPE.MAJOR
    }

    _getAvailableByIncrementType(releases, currentVersion, incrementType) {
        var currentVersionSplit = currentVersion.split('.')
        var result = {
            status: _UPDATE_STATUS.UNDEFINED,
            version: '',
            latest: semver.clean(releases[releases.length - 1])
        }

        if (releases.length) {
            switch (incrementType) {
                case _INCREMENT_TYPE.PATCH:
                    result.version = semver.clean(semver.maxSatisfying(releases, `${currentVersionSplit[0]}.${currentVersionSplit[1]}.*`))
                    break;

                case _INCREMENT_TYPE.MINOR:
                    result.version = semver.clean(semver.maxSatisfying(releases, `${currentVersionSplit[0]}.*.*`))
                    break;

                case _INCREMENT_TYPE.MAJOR:
                    result.version = semver.clean(semver.maxSatisfying(releases, '*.*.*'))
                    break;
            }
            if (result.version != currentVersion) {
                result.status = _UPDATE_STATUS.AVAILABLE
            } else {
                result.status = _UPDATE_STATUS.SAME
            }
        }
        return result
    }
}