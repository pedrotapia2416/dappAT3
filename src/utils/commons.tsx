import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_NAME = 'Sheet1';
const GOOGLE_SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A2:D:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

export const logPurchaseToGoogleSheets = async (account: string, amountAT3: number, totalUSDT: number) => {
  const purchaseData = {
    values: [
      [account, amountAT3, totalUSDT, new Date().toLocaleString()]
    ],
  };

  try {
    const response = await axios.post(GOOGLE_SHEETS_API_URL, purchaseData);
    console.log('Compra registrada con éxito:', response.data);
  } catch (error) {
    console.error('Error registrando la compra:', error);
  }
};
