import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const hourlyWage = 4.25;
// const eveningCompensationPerHour = 1.25;
const baseHours = 8;
// const eveningStartTime = '19:00';
// const eveningEndTime = '6:00';

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
            let dailyWage = 0;
            let start = this.parseDate(shift.date, shift.start);
            let end = this.parseDate(shift.date, shift.end);
            if (end.isBefore(start)) end.add(1, 'day');
            let hours = end.diff(start, 'minute') / 60;
            dailyWage += hours * hourlyWage;
            dailyWage += this.calculateOvertimeBonus(hours);
            // let eveningStart = this.parseDate(shift.date, eveningStartTime);
            // let eveningEnd = this.parseDate(shift.date, eveningEndTime);
            // let earlyHours = eveningEnd.diff(start, 'hours');
            monthlyWage += dailyWage;
        });
        return monthlyWage;
    }

    static calculateOvertimeBonus(hours) {
        let overtimeHours = hours - baseHours;
        if (overtimeHours <= 0) return 0;
        let hours25 = 0;
        let hours50 = 0;
        let hours100 = 0;
        if (overtimeHours <= 3) {
            hours25 = overtimeHours;
        } else if (overtimeHours <= 4) {
            hours25 = 3;
            hours50 = overtimeHours - 3;
        } else {
            hours25 = 3;
            hours50 = 1;
            hours100 = overtimeHours - 4;
        }
        return hours25 * hourlyWage * .25
             + hours50 * hourlyWage * .5
             + hours100 * hourlyWage;
    }

    static calculateOvertimeBonus25(hours) {
        return hours * hourlyWage * .25;
    }

    static parseDate(date, time) {
        return dayjs(date + ' ' + time, { format: 'D.M.YYYY H:mm' });
    }
}

export default WageCalculator;