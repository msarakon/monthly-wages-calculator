import React from 'react';
import CSVParser from './csv-parser';
import WageCalculator from './wage-calculator';
import PersonList from './person-list';
import './csv-upload.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            personRows: [],
            error: ''
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(event) {
        this.setState({ personRows: [] });
        let file = event.target.files[0];
        let _this = this;
        try {
            CSVParser.toJSON(file, function(personData) {
                try {
                    let rows = WageCalculator.getMonthlyWages(personData);
                    _this.setState({
                        personRows: rows,
                        error: ''
                    });
                } catch (exception) {
                    _this.setState({ error: exception });
                }
            });
        } catch (exception) {
            this.setState({ error: exception });
        }
    }

    render() {
        return (
            <div className="container">
                <input id="file-upload" type="file" onChange={this.handleFileUpload} />
                <span className="error-message">{this.state.error}</span>
                <PersonList data={this.state.personRows} />
            </div>
        );
    }
}

export default App;