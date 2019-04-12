import dayjs from 'dayjs';
import WageCalculator from '../src/wage-calculator';

test('should calculate monthly wages correctly with 0 shifts', () => {
    let data = { 123: { name: 'Test Foobar', shifts: [] } };
    let expected = [{ id: '123', name: 'Test Foobar', monthlyWage: 0 }];
    expect(WageCalculator.getMonthlyWages(data)).toEqual(expected);
});

test('should calculate monthly wages correctly', () => {
    let data = {
        '123': {
            name: 'Test Foobar',
            shifts: [
                { date: '12.4.2019', start: '08:00', end: '16:00' }
            ]
        },
        '456': {
            name: 'Lorem Ipsum',
            shifts: [
                { date: '12.4.2019', start: '22:00', end: '6:00' } 
            ]
        },
        '789': {
            name: 'Peppa Pig',
            shifts: [
                { date: '12.4.2019', start: '6:00', end: '16:00' } 
            ]
        }
    };
    let expected = [
        { 
            id: '123',
            name: 'Test Foobar',
            monthlyWage: 8 * 4.25
        },
        {
            id: '456',
            name: 'Lorem Ipsum',
            monthlyWage: 8 * 4.25 + 8 * 1.25
        },
        {
            id: '789',
            name: 'Peppa Pig',
            monthlyWage: 10 * 4.25 + 2 * 4.25 * .25
        }
    ];
    expect(WageCalculator.getMonthlyWages(data)).toEqual(expected);
});

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
    expect(WageCalculator.calculateEveningBonus(
        dayjs('2019-04-12 01:00'),
        dayjs('2019-04-12 03:00')
    )).toBe(2 * 1.25);
});