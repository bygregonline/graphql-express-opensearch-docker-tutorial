function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}



function getCurrentDateTime(now) {


    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}




function getnerateHtml(documents) {
    let html = `
        <table border="1" cellpadding="10" cellspacing="0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Track Number</th>
              <th>Year</th>
              <th>Comments</th>
              <th>Lyrics Length</th>
            </tr>
          </thead>
          <tbody>
      `;

    // Agregar los documentos a la tabla
    documents.forEach(doc => {
        html += `
          <tr>
            <td>${doc.title || ''}</td>
            <td>${doc.artist || ''}</td>
            <td>${doc.album || ''}</td>
            <td>${doc.genre || ''}</td>
            <td>${doc.tracknumber || ''}</td>
            <td>${doc.year || ''}</td>
            <td>${doc.comments || ''}</td>
            <td>${doc.lyrics_len || ''}</td>
          </tr>
        `;
    });

    // Cerrar la tabla
    html += `
          </tbody>
        </table>
      `;

    return html;
}



function generateTxt(documents) {

    const headers = ['Artist', 'Album', 'Genre', 'Title'];


    const rows = documents.map(doc => [
        doc.artist || '',
        doc.album || '',
        doc.genre || '',
        doc.title || ''
    ]);


    const columnWidths = headers.map((header, i) => {
        return Math.max(
            header.length,
            ...rows.map(row => (row[i] ? row[i].length : 0))
        );
    });

    const pad = (str, width) => {
        return str + ' '.repeat(width - str.length);
    };

    // Construir la tabla
    let tableText = '';

    // Agregar la cabecera
    tableText += headers.map((header, i) => pad(header, columnWidths[i])).join(' | ') + '\n';
    tableText += columnWidths.map(width => '-'.repeat(width)).join('-+-') + '\n';

    // Agregar las filas de datos
    rows.forEach(row => {
        tableText += row.map((cell, i) => pad(cell, columnWidths[i])).join(' | ') + '\n';
    });

    return tableText;

}

module.exports = { formatBytes, getCurrentDateTime, getnerateHtml, generateTxt }