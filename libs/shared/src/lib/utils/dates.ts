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
