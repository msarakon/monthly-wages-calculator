import React from 'react';
import { shallow } from 'enzyme';
import CSVUpload from '../src/csv-upload';

test('should contain a file input element', () => {
    const wrapper = shallow(<CSVUpload />);
    expect(wrapper.type()).toEqual('input');
});