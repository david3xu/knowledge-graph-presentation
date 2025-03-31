/**
 * Service for exporting presentations to different formats
 */
export class ExportService {
    /**
     * Exports the presentation as a PDF
     * @param element The DOM element containing the presentation
     * @param filename The filename for the exported PDF
     * @returns Promise that resolves when the export is complete
     */
    public async exportToPdf(element: HTMLElement): Promise<void> {
      try {
        const options = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: 'knowledge-graph-presentation.pdf',
          image: {
            type: 'jpeg',
            quality: 0.98
          },
          html2canvas: {
            scale: 2
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape'
          }
        };

        // Import html2pdf dynamically to avoid SSR issues
        if (typeof window !== 'undefined') {
          const html2pdf = (await import('html2pdf.js')).default;
          await html2pdf(element).set(options).save();
        }
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
      }
    }
    
    /**
     * Exports the presentation as a standalone HTML file
     * @param document The document to export
     * @param filename The filename for the exported HTML
     */
    exportToHTML(document: Document, filename: string): void {
      try {
        // Clone the document to modify it for export
        const docClone = document.cloneNode(true) as Document;
        
        // Remove any unwanted elements (like export buttons)
        const exportControls = docClone.querySelectorAll('.export-controls');
        exportControls.forEach(el => el.remove());
        
        // Get the HTML content
        const htmlContent = docClone.documentElement.outerHTML;
        
        // Create a blob and download link
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('HTML export failed:', error);
        this.showExportError('HTML export failed');
      }
    }
    
    /**
     * Exports the presentation as an image (PNG)
     * @param element The DOM element containing the presentation
     * @param filename The filename for the exported image
     */
    async exportToPNG(element: HTMLElement, filename: string): Promise<void> {
      try {
        // Dynamically import html2canvas
        const html2canvas = (await import('html2canvas')).default;
        
        this.showExportMessage('Exporting to PNG...');
        
        // Render the element to a canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        // Convert canvas to data URL and trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        this.hideExportMessage();
      } catch (error) {
        console.error('PNG export failed:', error);
        this.hideExportMessage();
        this.showExportError('PNG export failed');
      }
    }
    
    /**
     * Shows an export progress message
     * @param message Message to display
     */
    private showExportMessage(message: string): void {
      // Create or update message element
      let messageEl = document.getElementById('export-message');
      if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'export-message';
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-50%)';
        messageEl.style.background = 'rgba(0, 0, 0, 0.7)';
        messageEl.style.color = 'white';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '5px';
        messageEl.style.zIndex = '9999';
        document.body.appendChild(messageEl);
      }
      
      messageEl.textContent = message;
      messageEl.style.display = 'block';
    }
    
    /**
     * Hides the export message
     */
    private hideExportMessage(): void {
      const messageEl = document.getElementById('export-message');
      if (messageEl) {
        messageEl.style.display = 'none';
      }
    }
    
    /**
     * Shows an export error message
     * @param error Error message to display
     */
    private showExportError(error: string): void {
      this.showExportMessage(`Error: ${error}`);
      setTimeout(() => this.hideExportMessage(), 3000);
    }
  }
  
  // Create a singleton instance
  export const exportService = new ExportService();