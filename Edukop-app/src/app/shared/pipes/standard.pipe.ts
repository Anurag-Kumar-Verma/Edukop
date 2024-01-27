import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'standardToNumber' })
export class StandardPipe implements PipeTransform {
    transform(standard: string): string {
        if (standard === 'first') {
            return '1st';
        } else if (standard === 'second') {
            return '2nd';
        } else if (standard === 'third') {
            return '3rd';
        } else if (standard === 'fourth') {
            return '4th';
        } else if (standard === 'fifth') {
            return '5th';
        } else if (standard === 'sixth') {
            return '6th';
        } else if (standard === 'seventh') {
            return '7th';
        } else if (standard === 'eighth') {
            return '8th';
        } else if (standard === 'ninth') {
            return '9th';
        } else if (standard === 'tenth') {
            return '10th';
        } else if (standard === 'eleventh') {
            return '11th';
        } else if (standard === 'twelfth') {
            return '12th';
        } else if (standard === 'Nursery') {
            return 'Nur';
        } else if (standard === 'LKG') {
            return 'LKG';
        } else if (standard === 'UKG') {
            return 'UKG';
        } else if (standard === 'Pre-School') {
            return 'Pre';
        }
    }
}
