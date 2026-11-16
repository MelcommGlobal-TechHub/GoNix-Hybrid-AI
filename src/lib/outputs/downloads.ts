import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { toPng, toSvg } from 'html-to-image'
import type { DownloadFormat } from './types'

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function safeFilename(title: string): string {
  return title
    .replace(/[^a-z0-9-_ ]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70) || 'gonix-ai-result'
}

export async function downloadTextResult(
  title: string,
  content: string,
  format: Extract<DownloadFormat, 'pdf' | 'docx' | 'txt'>,
): Promise<void> {
  const filename = safeFilename(title)

  if (format === 'txt') {
    saveBlob(
      new Blob([content], { type: 'text/plain;charset=utf-8' }),
      `${filename}.txt`,
    )
    return
  }

  if (format === 'pdf') {
    const pdf = new jsPDF()
    const margin = 16
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const maxWidth = pageWidth - margin * 2
    const lines = pdf.splitTextToSize(content, maxWidth)
    let y = 22

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    pdf.text(title, margin, y)
    y += 12

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)

    for (const line of lines) {
      if (y > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }

      pdf.text(line, margin, y)
      y += 5
    }

    pdf.save(`${filename}.pdf`)
    return
  }

  const documentFile = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
        }),
        ...content.split(/\r?\n/).map(
          (line) => new Paragraph({
            children: [new TextRun(line)],
          }),
        ),
      ],
    }],
  })

  const blob = await Packer.toBlob(documentFile)
  saveBlob(blob, `${filename}.docx`)
}

export async function downloadVisualResult(
  element: HTMLElement,
  title: string,
  format: Extract<DownloadFormat, 'png' | 'svg' | 'pdf'>,
): Promise<void> {
  const filename = safeFilename(title)

  if (format === 'svg') {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#111113',
      pixelRatio: 2,
    })

    const response = await fetch(dataUrl)
    const blob = await response.blob()
    saveBlob(blob, `${filename}.svg`)
    return
  }

  const dataUrl = await toPng(element, {
    backgroundColor: '#111113',
    pixelRatio: 2,
  })

  if (format === 'png') {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    saveBlob(blob, `${filename}.png`)
    return
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const image = new Image()

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Could not prepare the visual for PDF export.'))
    image.src = dataUrl
  })

  const scale = Math.min(
    (pageWidth - 40) / image.width,
    (pageHeight - 40) / image.height,
  )

  const width = image.width * scale
  const height = image.height * scale

  pdf.addImage(
    dataUrl,
    'PNG',
    (pageWidth - width) / 2,
    (pageHeight - height) / 2,
    width,
    height,
  )

  pdf.save(`${filename}.pdf`)
}
