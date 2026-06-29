/**
 * Export the phone preview element as a high-resolution PNG
 */
export async function exportAsImage(elementId: string, filename = 'imessage-mockup.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Export target element not found');
    return;
  }

  try {
    // Dynamically import html2canvas to keep bundle lean
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(element, {
      scale: 3, // 3x for high-resolution output
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      // Improve font rendering
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Ensure crisp rendering in export
          clonedElement.style.transform = 'none';
        }
      },
    });

    // Trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  } catch (err) {
    console.error('Export failed:', err);
    alert('Export failed. Please try again.');
  }
}
