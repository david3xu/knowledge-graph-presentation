declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: { mode?: string; before?: string[]; after?: string[]; avoid?: string[] };
    enableLinks?: boolean;
  }

  interface Html2Pdf {
    from(element: HTMLElement | string): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): Promise<void>;
    toPdf(): any;
    output(type: string, options?: any): Promise<any>;
  }

  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2Pdf;
  
  namespace html2pdf {
    function worker(): Html2Pdf;
  }

  export default html2pdf;
} 