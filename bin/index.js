#!/usr/bin/env node

'use strict';

const yargs = require('yargs')
const chalk = require('chalk');
const Table = require('cli-table');

const Sifer = require('../src');

const argv = yargs.scriptName("sifer")
    .usage('$0 <cmd> [args]')
    .command('scan [path]', 'Path to be scanned, can be file or directory (note: if the path is not provided, it will use the current path where it is being executed)\n',
        yargs => {
            yargs.positional('path',
                {
                    type: 'string',
                    default: process.cwd(),
                    describe: 'Path to be scanned'
                }
            )
        }, async argv => {
            await scan(argv)
        }
    )
/* The update cmd already in progress
    .command('update [path]', 'Update file following increment type',
        yargs => {
            yargs.positional('path',
                {
                    type: 'string',
                    describe: 'File path',
                    default: '--patch'
                }
            )
                .option('patch', {
                    description: 'Update patch version'
                })
                .option('minor', {
                    description: 'Update minor version'
                })
                .option('major', {
                    description: 'Update major version'
                })
        }, async argv => {
            if (Sifer.isFile(argv.path)) {
                if (!!argv.path) {
                    let file = await Sifer.scan(argv.path)
                    Sifer.update(await Sifer.readFile(file.pop()), argv)
                    scan(argv)
                }
            } else {
                console.log('Please, provide the file path')
            }
        }
    )
*/
    .help()
    .alias('version', 'v')
    .alias('help', 'h')
    .argv

if (argv._.length == 0) {
    argv._ = [process.cwd()]
    scan(argv)
}

async function scan(argv) {
    let files = [];

    /**
     * If have path then scan with given path
     * else scan current workdir
     */
    if (!!argv.path) {
        files = await Sifer.scan(argv.path)
    } else {
        files = await Sifer.scan(process.cwd())
    }

    /**
     * Read each file scanned and get content to create table
     */
    if (files.length) {
        for (const file of files) {
            printTable(await Sifer.readFile(file))
        }
    } else {
        console.log('File not found')
    }
}

function printTable(file) {
    let result = '';

    Object.entries(file.content)
        .forEach(
            ([title, dependencies]) => {
                let table = new Table({
                    head: ['Package', 'Version', 'Update\n'],
                    colWidths: [45, 22, 25],
                    chars: {
                        'top-mid': '', 'top-left': '', 'top-right': ''
                        , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                        , 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                        , 'right': '', 'right-mid': '', 'middle': ' '
                    },
                    style: { 'padding-left': 2, 'padding-right': 0, head: ['reset'] }
                });

                if (dependencies.length) {
                    result += `\n ${chalk.gray(title.toUpperCase())}\n`

                    dependencies
                        .forEach(
                            pkg => {
                                var version = pkg.update.version
                                var status = pkg.update.status
                                var available = '';

                                if (status == 0) {
                                    available = chalk`{red ▬}`
                                } else if (status == 1) {
                                    available = chalk`{green Up to date}`
                                } else {
                                    available = chalk.keyword('orange')(`${version} [${pkg.version.incrementType}]`)
                                }

                                table.push([pkg.name, pkg.version.current, available])
                            }
                        )

                    result += table.toString() + '\n'
                }
            }
        )
    console.log(`\n${result}\n`);
}