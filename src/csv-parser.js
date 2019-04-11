class CSVParser {

    toJSON(file, callback) {
        if (!this.isAllowedType(file.name)) {
            throw 'Please upload a .csv file';
        }
        let reader = new FileReader();
        let output = [];
        reader.onload = () => {
            let rows = reader.result.split('\n');
            rows.shift();
            rows.forEach(row => output.push(this.rowToJSON(row)));
            callback(output);
        };
        reader.readAsBinaryString(file);
    }

    rowToJSON(row) {
        let values = row.split(',');
        return {
            personName: values[0],
            personId: values[1],
            date: values[2],
            startTime: values[3],
            endTime: values[4]
        };
    }

    isAllowedType(filename) {
        return /(\.csv)$/i.exec(filename);
    }
}

export default CSVParser;