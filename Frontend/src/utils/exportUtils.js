import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = "transactions") => {
    if(!data || data.length === 0) {
        alert("No Data To Export");
        return;
    }

    try {
        const workSheet = XLSX.utils.json_to_sheet(data);

        // Creating A WorkBook

        const WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(WorkBook, workSheet, "Transactions");

        // Generating the Excel

        XLSX.writeFile(WorkBook, `${fileName}.xlsx`, {
            bookType: "xlsx",
            type: "array"
        });
    } catch (error) {
        console.error("Export error: ", error);
        alert("Error exporting data. Please Try Again!");
    }
}