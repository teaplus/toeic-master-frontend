import { callAPIWithToken } from "./jwt-service";

export const exportCsvAPI = async (type: "users" | "tests") => {
  try {
    const response = await callAPIWithToken({
      url: `/admin/export-csv/${type}`,
      method: "get",
      responseType: "blob", // Quan trọng để xử lý file
    });

    // Tạo blob URL và trigger download
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${type}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error(`Error exporting ${type}:`, error);
    throw error;
  }
};
