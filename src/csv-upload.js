import React from 'react';
import CSVParser from './csv-parser';
import WageCalculator from './wage-calculator';

class CSVUpload extends React.Component {

    handleFileUpload(event) {
        let rows = [];
        let file = event.target.files[0];
        CSVParser.toJSON(file, function(personData) {
            rows = WageCalculator.getMonthlyWages(personData);
        });
    }

    render() {
        return (
            <input type="file" onChange={this.handleFileUpload} />
        );
    }
}

export default CSVUpload;