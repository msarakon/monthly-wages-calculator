import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const hourlyWage = 4.25;
// const eveningCompensationPerHour = 1.25;

class WageCalculator {

    static getMonthlyWages(shiftData) {
        let output = [];
        for (const personId in shiftData) {
            let personData = shiftData[personId];
            output.push({
                id: personId,
                name: personData.name,
                monthlyWage: this.calculateMonthlyWage(personData.shifts)
            });
        }
        return output;
    }

    static calculateMonthlyWage(shifts) {
        let monthlyWage = 0;
        shifts.forEach(shift => {
            let start = this.parseDate(shift.date, shift.start);
            let end = this.parseDate(shift.date, shift.end);
            let hours = end.diff(start, 'hour');
            monthlyWage += hours * hourlyWage;
        });
        return monthlyWage;
    }

    static parseDate(date, time) {
        return dayjs(date + ' ' + time, { format: 'D.M.YYYY H:mm' });
    }
}

export default WageCalculator;