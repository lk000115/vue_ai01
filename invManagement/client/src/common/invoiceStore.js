import { defineStore } from 'pinia';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoiceInfo: null,
  }),
  actions: {
    setInvoiceInfo(info) {
      this.invoiceInfo = info;
    }

  }
});
