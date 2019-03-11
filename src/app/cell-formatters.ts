import {Big as BigDecimal} from 'big.js';
import {DateTimeFormatter, LocalDate} from 'js-joda';

const BIG_ZERO = BigDecimal('0');
const BIG_100 = BigDecimal('100');

export const formatLocalDate = (row: any) => {
  const localDate = row.value;
  if (localDate instanceof LocalDate) {
    return localDate.format(DateTimeFormatter.ofPattern('MM/dd/yyyy'));
  } else {
    return row.value;
  }
};


// adapted from https://github.com/MikeMcl/big.js/issues/11#issuecomment-181470696
export const formatBigDecimal = (value: BigDecimal, decimalPlaces: number) => {
  const  thousandsSepartor = ',';
  const decimalSeparator = '.';
  const arr = value.toFixed(decimalPlaces).split(decimalSeparator);
  arr[0] = arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSepartor);
  return arr.join(decimalSeparator);
};

export const formatBigDecimalScale0 = (cell: any): string => {
  const amount: any = cell.value;

  if (amount instanceof BigDecimal) {
    return formatBigDecimal(amount, 0);
  } else {
    return amount;
  }
};

export const formatBigDecimalScale2 = (cell: any): string => {
  const amount: any = cell.value;

  if (amount instanceof BigDecimal) {
    return formatBigDecimal(amount, 2);
  } else {
    return amount;
  }
};

export const formatBigDecimalCurrency = (cell: any): string => {
  const amount: any = cell.value;

  if (amount instanceof BigDecimal) {
    const formatted = formatBigDecimal(amount, 0);
    if (amount.lt(BIG_ZERO)) {
      return `(${formatted.substring(1)})`;
    } else {
      return formatted;
    }
  } else {
    return amount;
  }
};

export const formatBigDecimalPercentage = (cell: any): string => {
  const amount: any = cell.value;

  if (amount instanceof BigDecimal) {
    return formatBigDecimal(amount.times(BIG_100), 0) + '%';
  } else {
    return amount;
  }
};
