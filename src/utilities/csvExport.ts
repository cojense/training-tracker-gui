/**
 * Utility to export an array of objects to a CSV file.
 */
export const exportToCSV = (
  filename: string,
  headers: string[],
  data: (string | number | null | undefined)[][]
) => {
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      row
        .map((val) => {
          const stringVal =
            val === null || val === undefined ? '' : String(val);
          // Escape quotes and wrap in quotes if contains comma
          if (stringVal.includes(',') || stringVal.includes('"')) {
            return `"${stringVal.replace(/"/g, '""')}"`;
          }
          return stringVal;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
