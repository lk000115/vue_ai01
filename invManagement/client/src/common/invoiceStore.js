import { defineStore } from 'pinia';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoiceInfo: null,
    pdftext: null
  }),
  actions: {
    setInvoiceInfo(info) {
      this.invoiceInfo = info;
    },
    setPdfText(data) {
      this.pdftext = data;
    }
  }
});
