import CSVParser from '../src/csv-parser';

test('should parse a CSV file to JSON', (done) => {
    let csvData = 'Person Name,Person ID,Date,Start,End\nTest Foobar,123,11.4.2019,6:30,15:30';
    let file = new File([csvData], 'test.csv', { type: 'text/csv' });
    new CSVParser().toJSON(file, function(data) {
        expect(data).toEqual([{
            personName: 'Test Foobar',
            personId: '123',
            date: '11.4.2019',
            startTime: '6:30',
            endTime: '15:30'
        }]);
        done();
    });
});

test('should throw an error in case of wrong file type', () => {
    let file = new File([], 'test.png', { type: 'image/png' });
    try {
        new CSVParser().toJSON(file, function(){});
    } catch (ex) {
        expect(ex).toBe('Please upload a .csv file');
    }
});