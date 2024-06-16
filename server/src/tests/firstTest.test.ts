import {expect, test} from 'vitest'

test("Math calculations", ()=>{
    expect(Math.max(2,3)).toBe(3)
    expect(Math.min(2,3)).toBe(2)
})
