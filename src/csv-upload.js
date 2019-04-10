import React from 'react';

class CSVUpload extends React.Component {

    handleFileUpload(event) {
        console.log(event);
    };

    render() {
        return (
            <input type="file" onChange={this.handleFileUpload} />
        )
    };
};

export default CSVUpload;