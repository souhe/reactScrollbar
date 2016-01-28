import expect from 'expect';
import {positiveOrZero, modifyObjValues} from '../src/js/utils';

describe('utils', () => {
   describe('positiveOrZero', () => {
       it('should return the same value for positive', () => {
           let result = positiveOrZero(12);
           expect(result).toBe(12);
       });
       
       it('should return 0 for 0 as argument', () => {
           let result = positiveOrZero(0);
           expect(result).toBe(0);
       });
       
       it('should return 0 for for negative argument value', () => {
           let result = positiveOrZero(-12);
           expect(result).toBe(0);
       });
   });
   
   describe('modifyObjValues', () => {
       it('should return object with modified all keys', () => {
           let result = modifyObjValues({a: 1, b: 2}, x => x + 1);
           expect(result).toEqual({a: 2, b: 3});
       });
       
       it('should return the same object when no second argument', () => {
           let result = modifyObjValues({a: 1, b: 2});
           expect(result).toEqual({a: 1, b: 2});
       });
   });
});
