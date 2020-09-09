const Scanner = require('..');

describe('Scan', () => {
    test('with empty input', () => {
        Scanner.scan()
            .then(files => expect(files).toBe(array))
            .catch(error => expect(error).toContain('not found'))
    });
    test('with `package.json` input', () => {
        const expected = ['package.json']
        Scanner.scan('package.json')
            .then(files => expect(files).toEqual(expect.arrayContaining(expected)))
            .catch(error => expect(error).toEqual(expect.stringContaining('Dir package.json not found')))
    });
})