import React from 'react';
import { shallow } from 'enzyme';
import PersonList from '../src/person-list';

test('should populate table rows with data from props', () => {
    const data = [
        { id: 1, name: 'Test Foobar', monthlyWage: 0 },
        { id: 1, name: 'Lorem Ipsum', monthlyWage: 10.29 },
        { id: 1, name: 'Peppa Pig', monthlyWage: 1500.13 }
    ];

    const wrapper = shallow(<PersonList data={data} />);

    expect(wrapper.find('tbody > tr').length).toBe(3);
});