import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const hourlyWage = 4.25;
const baseHours = 8;
const eveningBonusPerHour = 1.25;
const eveningStartHour = 19;
const eveningEndHour = 6;

class WageCalculator {

    /**
     * Returns persons and their monthly wages, based on shift data.
     * @param {Object} shiftData 
     */
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

    /**
     * Calculates monthly wage based on shifts, rounded to 2 decimals.
     * @param {Array} shifts 
     */
    static calculateMonthlyWage(shifts) {
        let monthlyWage = 0;
        shifts.forEach(shift => {
            let dailyWage = 0;
            let start = this.parseDate(shift.date, shift.start);
            let end = this.parseDate(shift.date, shift.end);
            if (end.isBefore(start)) {
                end = end.add(1, 'day');
            }
            let hours = end.diff(start, 'minute') / 60;
            dailyWage += hours * hourlyWage;
            dailyWage += this.calculateOvertimeBonus(hours);
            dailyWage += this.calculateEveningBonus(start, end);
            monthlyWage += dailyWage;
        });
        return Math.round(monthlyWage * 100) / 100;
    }

    /**
     * Calculates overtime compensation based on total hours.
     * @param {Number} hours 
     */
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

    /**
     * Calculates evening work compensation $ for given start and end dayjs objects.
     * @param {Object} start 
     * @param {Object} end 
     */
    static calculateEveningBonus(start, end) {
        let earlyHours = this.calculateEarlyHours(start, end);
        let lateHours = this.calculateLateHours(start, end);
        return (earlyHours + lateHours) * eveningBonusPerHour;
    }

    /**
     * Calculates work hours done during the previous night's shift.
     * @param {Object} start 
     * @param {Object} end 
     */
    static calculateEarlyHours(start, end) {
        let eveningEnd = start.clone().hour(eveningEndHour).minute(0);
        if (start.isBefore(eveningEnd)) {
            if (end.isBefore(eveningEnd)) {
                return this.diffHours(end, start);
            } else {
                return this.diffHours(eveningEnd, start);
            }
        }
        return 0;
    }

    /**
     * Calculates work hours done during the following night's shift.
     * @param {Object} start 
     * @param {Object} end 
     */
    static calculateLateHours(start, end) {
        let eveningStart = start.clone().hour(eveningStartHour).minute(0);
        if (end.isAfter(eveningStart)) {
            if (start.isAfter(eveningStart)) {
                return this.diffHours(end, start);
            } else {
                return this.diffHours(end, eveningStart);
            }
        }
        return 0;
    }

    /**
     * Calculates the difference between two dayjs objects in hours.
     * @param {Object} from 
     * @param {Object} to 
     */
    static diffHours(from, to) {
        return from.diff(to, 'minute') / 60;
    }

    /**
     * Parses a dayjs object from D.M.YYY and H:mm strings.
     * @param {String} date 
     * @param {String} time 
     */
    static parseDate(date, time) {
        return dayjs(date + ' ' + time, { format: 'D.M.YYYY H:mm' });
    }
}

export default WageCalculator;