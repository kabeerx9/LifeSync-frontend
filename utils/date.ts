export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // Feb
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two-digit minutes

  return `${day} ${month} at ${formattedHours}:${formattedMinutes} ${ampm}`;
}
