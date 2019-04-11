import WageCalculator from '../src/wage-calculator';

test('should calculate overtime bonus correctly', () => {
    expect(WageCalculator.calculateOvertimeBonus(3)).toBe(0);
    expect(WageCalculator.calculateOvertimeBonus(8)).toBe(0);
    expect(WageCalculator.calculateOvertimeBonus(8.5)).toBe(.5 * 4.25 * .25);
    expect(WageCalculator.calculateOvertimeBonus(9)).toBe(4.25 * .25);
    expect(WageCalculator.calculateOvertimeBonus(11)).toBe(3 * 4.25 * .25);
    expect(WageCalculator.calculateOvertimeBonus(12)).toBe(3 * 4.25 * .25 + 4.25 * .5);
    expect(WageCalculator.calculateOvertimeBonus(12.25)).toBe(3 * 4.25 * .25 + 4.25 * .5 + .25 * 4.25);
    expect(WageCalculator.calculateOvertimeBonus(15)).toBe(3 * 4.25 * .25 + 4.25 * .5 + 3 * 4.25);
});