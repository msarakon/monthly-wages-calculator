import React from 'react';
import PropTypes from 'prop-types';

class PersonList extends React.Component {

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Monthly wage</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.data.map(row => {
                            return <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td>{row.monthlyWage}</td>
                            </tr>;
                        })
                    }
                </tbody>
            </table>
        );
    }
}

PersonList.propTypes = {
    data: PropTypes.array
};

export default PersonList;