import React from 'react';
import CSVParser from './csv-parser';

class CSVUpload extends React.Component {

    handleFileUpload(event) {
        let file = event.target.files[0];
        new CSVParser().toJSON(file, function() {
            // todo
        });
    }

    render() {
        return (
            <input type="file" onChange={this.handleFileUpload} />
        );
    }
}

export default CSVUpload;