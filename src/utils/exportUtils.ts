import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export growth metrics to PDF
export const exportMetricsToPDF = (metrics: any[], categories: any[]) => {
  const doc = new jsPDF();
  const activeCategories = categories.filter(c => c.id !== 'Toutes');
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Tableau des Métriques Startup', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} - StartUnup.tn`, 14, 28);
  
  let yPosition = 35;
  
  activeCategories.forEach((category) => {
    const categoryMetrics = metrics.filter(m => m.category === category.id);
    if (categoryMetrics.length === 0) return;
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(category.label || category.name || category.id, 14, yPosition);
    yPosition += 5;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Symbole', 'Nom', 'Formule', 'Source']],
      body: categoryMetrics.map(m => [m.code || m.symbol, m.name || m.nameFr, m.formula, m.source || '']),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 14 },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
    
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  doc.save('metriques-startup.pdf');
};

// Export BM patterns to PDF
export const exportPatternsToPDF = (patterns: any[], title: string, filename: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} - StartUnup.tn`, 14, 28);
  
  autoTable(doc, {
    startY: 35,
    head: [['#', 'Symbole', 'Nom', 'Idée / Description']],
    body: patterns.map((p, i) => [
      p.number || p.id || i + 1,
      p.symbol,
      p.name || p.nom,
      (p.idea || p.description || '').substring(0, 80) + '...'
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 15 },
      2: { cellWidth: 35 },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 14 },
  });
  
  doc.save(filename);
};

// Export ecosystem actors to PDF
export const exportEcosystemToPDF = (actors: any[], title: string, filename: string) => {
  const doc = new jsPDF('landscape');
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} - StartUnup.tn`, 14, 28);
  
  autoTable(doc, {
    startY: 35,
    head: [['Symbole', 'Nom', 'Catégorie', 'Description', 'Localisation']],
    body: actors.map(a => [
      a.symbol,
      a.name,
      a.category,
      (a.description || '').substring(0, 60) + '...',
      a.location
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 25 }
    },
    margin: { left: 14 },
  });
  
  doc.save(filename);
};

// Export combos to PDF
export const exportCombosToPDF = (combos: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Combinaisons de Métriques', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')} - StartUnup.tn`, 14, 28);
  
  autoTable(doc, {
    startY: 35,
    head: [['Nom', 'Catégorie', 'Formule', 'Interprétation']],
    body: combos.map(c => [
      c.name,
      c.category,
      c.formula,
      (c.interpretation || '').substring(0, 50) + '...'
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [139, 92, 246] },
    margin: { left: 14 },
  });
  
  doc.save('combos-metriques.pdf');
};

// Export all cards to single PDF
export const exportAllCardsToPDF = (
  metrics: any[],
  metricCategories: any[],
  bmPatterns: any[],
  sustainablePatterns: any[],
  ecosystemActors: any[],
  combos: any[]
) => {
  const doc = new jsPDF();
  
  // Title page
  doc.setFontSize(28);
  doc.setTextColor(79, 70, 229);
  doc.text('StartUnup.tn', 105, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Référentiel Complet', 105, 100, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Métriques • Business Model Patterns • Écosystème • Combos', 105, 115, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 140, { align: 'center' });
  
  // Metrics section
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text('1. Métriques Startup (86 métriques)', 14, 20);
  
  let yPos = 30;
  const activeMetricCategories = metricCategories.filter(c => c.id !== 'Toutes');
  activeMetricCategories.forEach((cat) => {
    const catMetrics = metrics.filter(m => m.category === cat.id);
    if (catMetrics.length === 0) return;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(cat.label || cat.name || cat.id, 14, yPos);
    yPos += 3;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Sym', 'Nom', 'Formule', 'Source']],
      body: catMetrics.map(m => [m.code || m.symbol, m.name || m.nameFr, m.formula, m.source || '']),
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 14 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 8;
  });
  
  // BM Patterns
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text('2. Business Model Navigator (60 patterns)', 14, 20);
  
  autoTable(doc, {
    startY: 28,
    head: [['#', 'Sym', 'Nom', 'Idée']],
    body: bmPatterns.map(p => [p.number, p.symbol, p.name, (p.idea || '').substring(0, 60) + '...']),
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fillColor: [236, 72, 153] },
    margin: { left: 14 },
  });
  
  // Sustainable Patterns
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text('3. Sustainable Patterns (45 patterns)', 14, 20);
  
  autoTable(doc, {
    startY: 28,
    head: [['#', 'Sym', 'Nom', 'Groupe']],
    body: sustainablePatterns.map(p => [p.id, p.symbol, p.nom, p.groupe]),
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14 },
  });
  
  // Ecosystem
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text('4. Écosystème Tunisien (70+ acteurs)', 14, 20);
  
  autoTable(doc, {
    startY: 28,
    head: [['Sym', 'Nom', 'Catégorie', 'Localisation']],
    body: ecosystemActors.map(a => [a.symbol, a.name, a.category, a.location]),
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fillColor: [245, 158, 11] },
    margin: { left: 14 },
  });
  
  // Combos
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text('5. Combinaisons de Métriques', 14, 20);
  
  autoTable(doc, {
    startY: 28,
    head: [['Nom', 'Catégorie', 'Formule']],
    body: combos.map(c => [c.name, c.category, c.formula]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [139, 92, 246] },
    margin: { left: 14 },
  });
  
  doc.save('startunup-referentiel-complet.pdf');
};
