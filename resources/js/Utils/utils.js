export function convertUTCToLocal(utcDateString) {
    // Create a UTC date from the string
    const utcDate = new Date(utcDateString)

    // Get local timezone offset in minutes
    const timezoneOffset = utcDate.getTimezoneOffset()

    // Convert to local time by adjusting for timezone offset
    return new Date(utcDate.getTime() - (timezoneOffset * 60000));
}
