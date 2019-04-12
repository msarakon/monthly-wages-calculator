import CSVParser from '../src/csv-parser';

test('should parse shift data from a CSV file', (done) => {
    let csvData = 'Person Name,Person ID,Date,Start,End\n'
                + 'Test Foobar,123,11.4.2019,6:30,15:30\n'
                + 'Good Guy,456,1.4.2019,7:00,15:00\n'
                + 'Good Guy,456,5.4.2019,7:30,15:30\n';
    let file = new File([csvData], 'test.csv', { type: 'text/csv' });

    CSVParser.toJSON(file, function(data) {
        expect(data).toEqual({
            '123': {
                name: 'Test Foobar',
                shifts: [
                    { date: '11.4.2019', start: '6:30', end: '15:30' }
                ]
            },
            '456': {
                name: 'Good Guy',
                shifts: [
                    { date: '1.4.2019', start: '7:00', end: '15:00' },
                    { date: '5.4.2019', start: '7:30', end: '15:30' }
                ]
            }
        });
        done();
    });
});

test('should throw an error in case of wrong file type', () => {
    let file = new File([], 'test.png', { type: 'image/png' });
    try {
        CSVParser.toJSON(file, function(){});
    } catch (ex) {
        expect(ex).toBe('Please upload a .csv file! ヽ(#ﾟДﾟ)ﾉ');
    }
});