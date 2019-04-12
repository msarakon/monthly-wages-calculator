/**
 * Parses person data from a CSV file.
 * TODO: Better data validation.
 * For now, WageCalculator throws an exception if the calculated value is NaN.
 */
class CSVParser {

    static toJSON(file, callback) {
        if (!this.isAllowedType(file.name)) {
            throw 'Please upload a .csv file! ヽ(#ﾟДﾟ)ﾉ';
        }
        let reader = new FileReader();
        let output = {};
        reader.onload = () => {
            let rows = reader.result.split('\n');
            rows.shift(); // remove the header row
            rows.forEach(row => {
                let values = row.split(',');
                if (values.length < 5) return;
                let personId = values[1];
                if (!(personId in output)) {
                    output[personId] = { name: values[0], shifts: [] };
                }
                output[personId].shifts.push({
                    date: values[2],
                    start: values[3],
                    end: values[4]
                });
            });
            callback(output);
        };
        reader.readAsBinaryString(file);
    }

    static isAllowedType(filename) {
        return /(\.csv)$/i.exec(filename);
    }
}

export default CSVParser;