import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString: string | Date): string => {
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (!isValid(date)) {
      return 'Invalid date';
    }

    return format(date, 'dd-MM-yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};
