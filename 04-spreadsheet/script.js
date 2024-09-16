const sheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const cellStatus = document.querySelector("#cell-status span");
const filename = document.querySelector("#filename");
const ROWS = 100;
const COLS = 27;
const sheet = [];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function(e) {
    let csv = "";
    for (let i = 1; i < sheet.length; i++) {
        csv += sheet[i]
            .filter(item => !item.isHeader)
            .map(item => item.data)
            .join(',') + "\r\n";
    }
    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = `${filename.value}.csv`;
    a.click();
}                    

filename.addEventListener('change', function(e) {
    document.title = e.target.value;
});

initSheet();

function initSheet() {
    for (let i = 0; i < ROWS; i++) {
        let sheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            if (j === 0) {
                cellData = i === 0 ? '' : i;
                isHeader = true;
                disabled = true;
            }

            if (i === 0) {
                cellData = j === 0 ? '' : alphabet[j - 1];
                isHeader = true;
                disabled = true;
            }

            const rowName = i;
            const columnName = alphabet[j - 1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            sheetRow.push(cell);
        }
        sheet.push(sheetRow);
    }
    drawSheet();
}

function createCellElement(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = `cell_${cell.row}${cell.column}`;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderHighlights();
    if (!cell.isHeader) {
        const colHeader = sheet[0][cell.column];
        const rowHeader = sheet[cell.row][0];
        const colHeaderEl = getCellElement(colHeader.row, colHeader.column);
        const rowHeaderEl = getCellElement(rowHeader.row, rowHeader.column);
        colHeaderEl.classList.add('active');
        rowHeaderEl.classList.add('active');
        cellStatus.textContent = `${cell.columnName}${cell.rowName}`;
    }
}

function clearHeaderHighlights() {
    const headers = document.querySelectorAll('.header');
    headers.forEach((header) => {
        header.classList.remove('active');
    });
}

function getCellElement(row, col) {
    return document.querySelector(`#cell_${row}${col}`);
}

function drawSheet() {
    sheetContainer.innerHTML = '';
    for (let i = 0; i < sheet.length; i++) {
        const rowContainer = document.createElement("div");
        rowContainer.className = "cell-row";
        for (let j = 0; j < sheet[i].length; j++) {
            const cell = sheet[i][j];
            rowContainer.append(createCellElement(cell));
        }
        sheetContainer.append(rowContainer);
    }
}