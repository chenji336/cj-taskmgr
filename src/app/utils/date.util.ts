import { parse, isDate, isValid, isFuture, differenceInYears } from "date-fns";

export const isValidDate  = (val: string): boolean => {
    const date = parse(val);
    console.log('date:', date)
    console.log('isDate(val):', isDate(val));
    console.log('isValid(date):', isValid(date));
    console.log('!isFuture(date) :', !isFuture(date));
    console.log('differenceInYears(date, Date.now()) < 150:', differenceInYears(date, Date.now()) < 150);
    return isDate(date)
    && isValid(date)
    && !isFuture(date) 
    && differenceInYears(date, Date.now()) < 150;
} 