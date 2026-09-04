export function bookingReference(date: string, slot: string) { return `VR-${date.replaceAll('-', '')}-${slot.replace(':', '')}`; }
