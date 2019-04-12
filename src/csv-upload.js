import React from 'react';
import CSVParser from './csv-parser';
import WageCalculator from './wage-calculator';
import PersonList from './person-list';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { personRows: [] };
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(event) {
        let file = event.target.files[0];
        let _this = this;
        CSVParser.toJSON(file, function(personData) {
            let rows = WageCalculator.getMonthlyWages(personData);
            _this.setState({ personRows: rows });
        });
    }

    render() {
        return (
            <div>
                <input id="file-upload" type="file" onChange={this.handleFileUpload} />
                <PersonList data={this.state.personRows} />
            </div>
        );
    }
}

export default App;