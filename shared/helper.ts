import { NavigationType } from './navigate-to.model';

export function isObjectNavigationType(type: NavigationType): boolean {
    return type === 'Account Dashboard' || 
           type === 'Activity' ||
           type === 'Survey' ||
           type === 'Slug' || 
           type === 'Custom';
}
