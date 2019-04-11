import React from 'react';
import { shallow } from 'enzyme';
import CSVUpload from '../src/csv-upload';

test('should handle file upload on change event', () => {
    const wrapper = shallow(<CSVUpload />);

    wrapper.simulate('change', {
        target: {
            files: [ new File([], 'test.csv', { type: 'text/csv' }) ]
        }
    });
});