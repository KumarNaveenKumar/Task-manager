const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('Should calculate with tip', () => {
    const total = calculateTip(10, 0.3)
    expect(total).toBe(13)
    // if (total !== 13) {
    //     throw new Error(`Total tip shoould be 13. Got ${total}`)
    // }
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(100)
    expect(total).toBe(125)
})

test('Should convert 32 F to 0 C', () => {
    const temperature = fahrenheitToCelsius(32)
    expect(temperature).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temperature = celsiusToFahrenheit(0)
    expect(temperature).toBe(32)
})

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('Should add two number', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add to numbers async/await', async () => {
    const sum = await add(10, 8)
    expect(sum).toBe(18)
})