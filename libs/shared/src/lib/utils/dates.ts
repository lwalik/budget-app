export const compareDatesWithoutTime = (
  date1: Date,
  date2: Date,
  compareFn: (d1: Date, d2: Date) => boolean
): boolean => {
  const day1WithoutTime: Date = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const day2WithoutTime: Date = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );

  return compareFn(day1WithoutTime, day2WithoutTime);
};

export const isBeforeDate = (d1: Date, d2: Date): boolean => {
  return d1.getTime() < d2.getTime();
};

export const isAfterDate = (d1: Date, d2: Date): boolean => {
  return d1.getTime() > d2.getTime();
};

export const formatDateToString = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();

  return `${year}-${month < 10 ? '0' + month : month}-${
    day < 10 ? '0' + day : day
  }`;
};

export const getDayWithMonthAsString = (date: Date): string => {
  return `${String(date.getDate()).padStart(2, '0')}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${String(date.getFullYear()).slice(2)}`;
};
