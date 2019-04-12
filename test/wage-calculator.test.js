import dayjs from 'dayjs';
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

test('should calculate evening work compensation correctly', () => {
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 08:00'),
        dayjs('2019-04-12 16:00')
    )).toBe(0);
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 05:00'),
        dayjs('2019-04-12 14:00')
    )).toBe(1.25);
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 06:00'),
        dayjs('2019-04-12 22:00')
    )).toBe(3 * 1.25);
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 05:15'),
        dayjs('2019-04-12 19:30')
    )).toBe(.75 * 1.25 + .5 * 1.25);
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 22:00'),
        dayjs('2019-04-13 06:00')
    )).toBe(8 * 1.25);
   expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 03:00'),
        dayjs('2019-04-12 08:00')
    )).toBe(3 * 1.25);
});