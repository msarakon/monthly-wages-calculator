import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Calculates monthly wages based on shift data and wage constants.
 * TODO: Support for 24+ hour shifts.
 */
class WageCalculator {

    static get HOURLY_WAGE() { return 4.25; } // base wage per hour
    static get BASE_HOURS() { return 8; } // normal work hours

    static get OVERTIME1_LIMIT() { return 3; } // 1st overtime compensation limit (hours)
    static get OVERTIME2_LIMIT() { return 4; } // 2nd overtime compensation limit (hours)
    static get OVERTIME1_FACTOR() { return .25; } // 1st overtime compensation factor
    static get OVERTIME2_FACTOR() { return .5; } // 2nd overtime compensation factor
    static get OVERTIME3_FACTOR() { return 1; } // 3rd overtime compensation factor

    static get EVENING_BONUS() { return 1.25; } // evening compensation $ per hour
    static get EVENING_START_HOUR() { return 19; } // evening compensation starts
    static get EVENING_END_HOUR() { return 6; } // evening compensation ends

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
            let hours = this.diffHours(end, start);
            dailyWage += hours * this.HOURLY_WAGE;
            dailyWage += this.calculateOvertimeBonus(hours);
            dailyWage += this.calculateEveningBonus(start, end);
            monthlyWage += dailyWage;
        });
        if (isNaN(monthlyWage)) throw 'Something went wrong! Bad data format.';
        return Math.round(monthlyWage * 100) / 100;
    }

    /**
     * Calculates overtime compensation based on total hours.
     * @param {Number} hours 
     */
    static calculateOvertimeBonus(hours) {
        let overtimeHours = hours - this.BASE_HOURS;
        if (overtimeHours <= 0) return 0;
        let hours1 = 0;
        let hours2 = 0;
        let hours3 = 0;
        if (overtimeHours <= this.OVERTIME1_LIMIT) {
            hours1 = overtimeHours;
        } else if (overtimeHours <= this.OVERTIME2_LIMIT) {
            hours1 = this.OVERTIME1_LIMIT;
            hours2 = overtimeHours - this.OVERTIME1_LIMIT;
        } else {
            hours1 = this.OVERTIME1_LIMIT;
            hours2 = this.OVERTIME2_LIMIT - this.OVERTIME1_LIMIT;
            hours3 = overtimeHours - this.OVERTIME2_LIMIT;
        }
        return hours1 * this.HOURLY_WAGE * this.OVERTIME1_FACTOR
             + hours2 * this.HOURLY_WAGE * this.OVERTIME2_FACTOR
             + hours3 * this.HOURLY_WAGE * this.OVERTIME3_FACTOR;
    }

    /**
     * Calculates evening work compensation $ for given start and end dayjs objects.
     * @param {Object} start 
     * @param {Object} end 
     */
    static calculateEveningBonus(start, end) {
        let earlyHours = this.calculateEarlyHours(start, end);
        let lateHours = this.calculateLateHours(start, end);
        return (earlyHours + lateHours) * this.EVENING_BONUS;
    }

    /**
     * Calculates work hours done during the previous night's shift.
     * @param {Object} start 
     * @param {Object} end 
     */
    static calculateEarlyHours(start, end) {
        let eveningEnd = start.clone().hour(this.EVENING_END_HOUR).minute(0);
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
        let eveningStart = start.clone().hour(this.EVENING_START_HOUR).minute(0);
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