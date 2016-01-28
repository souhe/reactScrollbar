import {positiveOrZero} from '../src/js/utils';

describe('utils', () => {
   describe('positiveOrZero', () => {
       it('should return the same value for positive', () => {
           let result = positiveOrZero(12);
           expect(result).to.equal(12);
       });
       
       it('should return 0 for 0 as argument', () => {
           let result = positiveOrZero(0);
           expect(result).to.equal(0);
       });
       
       it('should return 0 for for negative argument value', () => {
           let result = positiveOrZero(-12);
           expect(result).to.equal(0);
       });
   }) 
});
