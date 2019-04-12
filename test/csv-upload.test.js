import React from 'react';
import { shallow } from 'enzyme';
import CSVUpload from '../src/csv-upload';

test('should populate rows based on CSV upload', (done) => {
    const wrapper = shallow(<CSVUpload />);
    const csvData = 'Person Name,Person ID,Date,Start,End\nTest Foobar,123,11.4.2019,6:30,15:30';

    expect(wrapper.state().personRows.length).toEqual(0);

    wrapper.find('#file-upload').simulate('change', {
        target: {
            files: [ new File([csvData], 'test.csv', { type: 'text/csv' }) ]
        }
    });

    setTimeout(function() {
        expect(wrapper.state().personRows.length).toEqual(1);
        done();
    }, 10);
});

test('should handle empty CSV upload', (done) => {
    const wrapper = shallow(<CSVUpload />);

    wrapper.simulate('change', {
        target: {
            files: [ new File([], 'test.csv', { type: 'text/csv' }) ]
        }
    });

    setTimeout(function() {
        expect(wrapper.state().personRows.length).toEqual(0);
        done();
    }, 10);
});