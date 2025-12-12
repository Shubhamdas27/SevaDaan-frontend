import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

// Interface definitions for PDF generation
export interface ReportConfig {
  title: string;
  subtitle?: string;
  includeSummary: boolean;
  includeCharts: boolean;
  includeTables: boolean;
  includeMetrics: boolean;
  dateRange: { start: Date; end: Date };
  sections: ReportSection[];
  branding?: {
    logo?: string;
    organizationName: string;
    contactInfo?: string;
  };
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'metrics' | 'text';
  data?: any;
  chartId?: string;
  tableId?: string;
  content?: string;
  order: number;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: any[];
  config?: any;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
  summary?: string;
}

export interface MetricsData {
  totalDonations: number;
  totalVolunteers: number;
  activePrograms: number;
  successRate: number;
  growthRate: number;
  impactMetrics: Array<{ label: string; value: string; change?: number }>;
}

class PDFReportService {
  private pdf: jsPDF | null = null;
  private currentY = 20;
  private pageHeight = 297; // A4 height in mm
  private pageWidth = 210; // A4 width in mm
  private margin = 20;
  private lineHeight = 7;

  // Generate comprehensive PDF report
  async generateReport(config: ReportConfig, chartsData: ChartData[], tablesData: TableData[], metricsData: MetricsData): Promise<void> {
    try {
      this.pdf = new jsPDF();
      this.currentY = 20;

      // Add header and branding
      await this.addHeader(config);

      // Add report summary
      if (config.includeSummary) {
        await this.addSummary(config, metricsData);
      }

      // Add sections in order
      const sortedSections = config.sections.sort((a, b) => a.order - b.order);
      for (const section of sortedSections) {
        await this.addSection(section, chartsData, tablesData, metricsData);
      }

      // Add footer
      this.addFooter();

      // Save the PDF
      const fileName = `${config.title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      this.pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  // Generate quick summary report
  async generateQuickReport(metricsData: MetricsData, organizationName: string): Promise<void> {
    try {
      this.pdf = new jsPDF();
      this.currentY = 20;

      // Header
      this.pdf.setFontSize(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Quick Summary Report', this.margin, this.currentY);
      this.currentY += 15;

      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(organizationName, this.margin, this.currentY);
      this.currentY += 10;

      this.pdf.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, this.margin, this.currentY);
      this.currentY += 20;

      // Key metrics
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Key Metrics', this.margin, this.currentY);
      this.currentY += 10;

      const metrics = [
        { label: 'Total Donations', value: `₹${metricsData.totalDonations.toLocaleString()}` },
        { label: 'Active Volunteers', value: metricsData.totalVolunteers.toString() },
        { label: 'Active Programs', value: metricsData.activePrograms.toString() },
        { label: 'Success Rate', value: `${metricsData.successRate.toFixed(1)}%` },
        { label: 'Growth Rate', value: `${metricsData.growthRate.toFixed(1)}%` }
      ];

      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');

      metrics.forEach(metric => {
        this.checkPageBreak();
        this.pdf!.text(`${metric.label}: ${metric.value}`, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      });

      // Impact metrics
      if (metricsData.impactMetrics.length > 0) {
        this.currentY += 10;
        this.pdf.setFontSize(16);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Impact Metrics', this.margin, this.currentY);
        this.currentY += 10;

        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'normal');

        metricsData.impactMetrics.forEach(metric => {
          this.checkPageBreak();
          const changeText = metric.change ? ` (${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%)` : '';
          this.pdf!.text(`${metric.label}: ${metric.value}${changeText}`, this.margin, this.currentY);
          this.currentY += this.lineHeight;
        });
      }

      this.addFooter();
      this.pdf.save(`Quick_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating quick report:', error);
      throw new Error('Failed to generate quick report');
    }
  }

  // Generate chart-focused report
  async generateChartsReport(chartsData: ChartData[], organizationName: string): Promise<void> {
    try {
      this.pdf = new jsPDF();
      this.currentY = 20;

      // Header
      this.pdf.setFontSize(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Charts & Analytics Report', this.margin, this.currentY);
      this.currentY += 15;

      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(organizationName, this.margin, this.currentY);
      this.currentY += 10;

      this.pdf.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, this.margin, this.currentY);
      this.currentY += 20;

      // Add charts
      for (const chart of chartsData) {
        await this.addChartToReport(chart);
      }

      this.addFooter();
      this.pdf.save(`Charts_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating charts report:', error);
      throw new Error('Failed to generate charts report');
    }
  }

  // Private helper methods
  private async addHeader(config: ReportConfig): Promise<void> {
    // Logo (if provided)
    if (config.branding?.logo) {
      try {
        this.pdf!.addImage(config.branding.logo, 'PNG', this.margin, this.currentY, 30, 15);
        this.currentY += 20;
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }

    // Title
    this.pdf!.setFontSize(24);
    this.pdf!.setFont('helvetica', 'bold');
    this.pdf!.text(config.title, this.margin, this.currentY);
    this.currentY += 12;

    // Subtitle
    if (config.subtitle) {
      this.pdf!.setFontSize(16);
      this.pdf!.setFont('helvetica', 'normal');
      this.pdf!.text(config.subtitle, this.margin, this.currentY);
      this.currentY += 10;
    }

    // Organization info
    if (config.branding?.organizationName) {
      this.pdf!.setFontSize(14);
      this.pdf!.setFont('helvetica', 'bold');
      this.pdf!.text(config.branding.organizationName, this.margin, this.currentY);
      this.currentY += 8;
    }

    // Date range
    this.pdf!.setFontSize(12);
    this.pdf!.setFont('helvetica', 'normal');
    const dateRangeText = `Report Period: ${format(config.dateRange.start, 'MMM dd, yyyy')} - ${format(config.dateRange.end, 'MMM dd, yyyy')}`;
    this.pdf!.text(dateRangeText, this.margin, this.currentY);
    this.currentY += 8;

    // Generation date
    this.pdf!.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, this.margin, this.currentY);
    this.currentY += 15;

    // Add separator line
    this.pdf!.setLineWidth(0.5);
    this.pdf!.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  private async addSummary(_config: ReportConfig, metricsData: MetricsData): Promise<void> {
    this.checkPageBreak(50);

    this.pdf!.setFontSize(18);
    this.pdf!.setFont('helvetica', 'bold');
    this.pdf!.text('Executive Summary', this.margin, this.currentY);
    this.currentY += 12;

    // Key metrics in a grid
    this.pdf!.setFontSize(12);
    this.pdf!.setFont('helvetica', 'normal');

    const metricsGrid = [
      ['Total Donations', `₹${metricsData.totalDonations.toLocaleString()}`],
      ['Active Volunteers', metricsData.totalVolunteers.toString()],
      ['Active Programs', metricsData.activePrograms.toString()],
      ['Success Rate', `${metricsData.successRate.toFixed(1)}%`],
      ['Growth Rate', `${metricsData.growthRate.toFixed(1)}%`]
    ];

    const columnWidth = (this.pageWidth - 2 * this.margin) / 2;
    let row = 0;

    metricsGrid.forEach((metric, index) => {
      const col = index % 2;
      const x = this.margin + (col * columnWidth);
      const y = this.currentY + (row * this.lineHeight * 2);

      this.pdf!.setFont('helvetica', 'bold');
      this.pdf!.text(metric[0], x, y);
      this.pdf!.setFont('helvetica', 'normal');
      this.pdf!.text(metric[1], x, y + this.lineHeight);

      if (col === 1) row++;
    });

    this.currentY += Math.ceil(metricsGrid.length / 2) * this.lineHeight * 2 + 10;
  }

  private async addSection(section: ReportSection, chartsData: ChartData[], tablesData: TableData[], metricsData: MetricsData): Promise<void> {
    this.checkPageBreak(30);

    // Section title
    this.pdf!.setFontSize(16);
    this.pdf!.setFont('helvetica', 'bold');
    this.pdf!.text(section.title, this.margin, this.currentY);
    this.currentY += 12;

    switch (section.type) {
      case 'chart':
        if (section.chartId) {
          const chart = chartsData.find(c => c.id === section.chartId);
          if (chart) {
            await this.addChartToReport(chart);
          }
        }
        break;

      case 'table':
        if (section.tableId) {
          const table = tablesData.find(t => t.id === section.tableId);
          if (table) {
            this.addTableToReport(table);
          }
        }
        break;

      case 'metrics':
        this.addMetricsToReport(metricsData);
        break;

      case 'text':
        if (section.content) {
          this.addTextToReport(section.content);
        }
        break;
    }

    this.currentY += 10;
  }

  private async addChartToReport(chart: ChartData): Promise<void> {
    this.checkPageBreak(80);

    // Chart title
    this.pdf!.setFontSize(14);
    this.pdf!.setFont('helvetica', 'bold');
    this.pdf!.text(chart.title, this.margin, this.currentY);
    this.currentY += 10;

    try {
      // Try to capture chart element if it exists in DOM
      const chartElement = document.getElementById(chart.id);
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = this.pageWidth - 2 * this.margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        this.checkPageBreak(imgHeight + 5);
        this.pdf!.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
        this.currentY += imgHeight + 10;
      } else {
        // Fallback: add chart data summary
        this.pdf!.setFontSize(12);
        this.pdf!.setFont('helvetica', 'normal');
        this.pdf!.text('Chart data:', this.margin, this.currentY);
        this.currentY += this.lineHeight;

        if (Array.isArray(chart.data) && chart.data.length > 0) {
          chart.data.slice(0, 5).forEach(item => {
            const text = typeof item === 'object' ? JSON.stringify(item).substring(0, 80) + '...' : item.toString();
            this.pdf!.text(text, this.margin + 10, this.currentY);
            this.currentY += this.lineHeight;
          });
        }
        this.currentY += 10;
      }
    } catch (error) {
      console.warn('Could not add chart to PDF:', error);
      this.pdf!.setFontSize(12);
      this.pdf!.text('Chart could not be rendered in PDF', this.margin, this.currentY);
      this.currentY += this.lineHeight + 10;
    }
  }

  private addTableToReport(table: TableData): void {
    this.checkPageBreak(30);

    // Table title
    this.pdf!.setFontSize(14);
    this.pdf!.setFont('helvetica', 'bold');
    this.pdf!.text(table.title, this.margin, this.currentY);
    this.currentY += 10;

    // Table headers
    this.pdf!.setFontSize(10);
    this.pdf!.setFont('helvetica', 'bold');
    
    const columnWidth = (this.pageWidth - 2 * this.margin) / table.headers.length;
    table.headers.forEach((header, index) => {
      const x = this.margin + (index * columnWidth);
      this.pdf!.text(header, x, this.currentY);
    });
    this.currentY += this.lineHeight;

    // Table rows
    this.pdf!.setFont('helvetica', 'normal');
    table.rows.slice(0, 20).forEach(row => { // Limit to 20 rows
      this.checkPageBreak();
      row.forEach((cell, index) => {
        const x = this.margin + (index * columnWidth);
        const cellText = cell.toString().substring(0, 15); // Truncate long text
        this.pdf!.text(cellText, x, this.currentY);
      });
      this.currentY += this.lineHeight;
    });

    if (table.rows.length > 20) {
      this.pdf!.text(`... and ${table.rows.length - 20} more rows`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    this.currentY += 10;
  }

  private addMetricsToReport(metricsData: MetricsData): void {
    this.checkPageBreak(40);

    this.pdf!.setFontSize(12);
    this.pdf!.setFont('helvetica', 'normal');

    const metrics = [
      { label: 'Total Donations', value: `₹${metricsData.totalDonations.toLocaleString()}` },
      { label: 'Active Volunteers', value: metricsData.totalVolunteers.toString() },
      { label: 'Active Programs', value: metricsData.activePrograms.toString() },
      { label: 'Success Rate', value: `${metricsData.successRate.toFixed(1)}%` }
    ];

    metrics.forEach(metric => {
      this.checkPageBreak();
      this.pdf!.text(`${metric.label}: ${metric.value}`, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });

    this.currentY += 5;
  }

  private addTextToReport(content: string): void {
    this.pdf!.setFontSize(12);
    this.pdf!.setFont('helvetica', 'normal');

    // Split text into lines that fit the page width
    const lines = this.pdf!.splitTextToSize(content, this.pageWidth - 2 * this.margin);
    
    lines.forEach((line: string) => {
      this.checkPageBreak();
      this.pdf!.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    });

    this.currentY += 5;
  }

  private addFooter(): void {
    const pageCount = this.pdf!.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf!.setPage(i);
      this.pdf!.setFontSize(10);
      this.pdf!.setFont('helvetica', 'normal');
      
      // Page number
      this.pdf!.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 10
      );
      
      // Generation info
      this.pdf!.text(
        `Generated by NGO Dashboard on ${format(new Date(), 'MMM dd, yyyy')}`,
        this.margin,
        this.pageHeight - 10
      );
    }
  }

  private checkPageBreak(requiredSpace: number = 20): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf!.addPage();
      this.currentY = 20;
    }
  }

  // Export data for external use
  async exportToCSV(data: any[], filename: string): Promise<void> {
    try {
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            typeof row[header] === 'string' ? `"${row[header]}"` : row[header]
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Failed to export CSV');
    }
  }

  // Schedule report generation
  scheduleReport(config: ReportConfig, schedule: 'daily' | 'weekly' | 'monthly'): void {
    // This would integrate with a backend service for actual scheduling
    console.log(`Report "${config.title}" scheduled for ${schedule} generation`);
    
    // For demo purposes, we'll just log the schedule
    const nextRun = new Date();
    switch (schedule) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
    }
    
    console.log(`Next report generation: ${format(nextRun, 'MMM dd, yyyy')}`);
  }
}

// Export singleton instance
export const pdfReportService = new PDFReportService();
