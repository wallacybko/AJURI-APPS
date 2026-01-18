
// This requires the SheetJS library to be loaded, e.g., via a script tag in index.html
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

declare var XLSX: any;

export const exportToExcel = (data: any[], fileName: string): void => {
  if (typeof XLSX === 'undefined') {
    console.error('XLSX library is not loaded. Please include it in your index.html');
    alert('Não foi possível exportar para Excel. A biblioteca necessária não foi carregada.');
    return;
  }
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Descontos');

  // Auto-fit columns
  const columnWidths = Object.keys(data[0] || {}).map(key => {
    const maxLength = Math.max(
        key.length, 
        ...data.map(item => String(item[key] || '').length)
    );
    return { wch: maxLength + 2 }; // +2 for padding
  });
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, fileName);
};
