export function convertTimeToMinutes(timeString: string): number {
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format. Please use hh:mm format.');
    }

    return hours * 60 + minutes;
}