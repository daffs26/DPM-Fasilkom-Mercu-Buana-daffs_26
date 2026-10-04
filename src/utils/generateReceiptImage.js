/**
 * Helper untuk men-generate gambar kartu tanda terima pendaftaran (PNG)
 * menggunakan HTML5 Canvas beresolusi tinggi (Retina 2x).
 * 
 * Ketentuan Desain:
 * 1. Deskripsi tiket tentang apa (Tanda Terima & Kunci Pemulihan Rahasia).
 * 2. Tepat di bawahnya: Kotak Kode Tiket yang kontras dan jelas.
 * 3. Rincian data pengurus (Nama, NIM, Ormawa, Jabatan, Username, Tanggal, Status).
 * 4. Branding resmi DPM FASILKOM UMB & Watermark keamanan.
 */

export function downloadReceiptAsPng(receipt) {
  if (!receipt) return;

  const scale = 2; // 2x scale for crisp retina export
  const width = 640 * scale;
  const height = 800 * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // 1. Background Kanvas
  ctx.fillStyle = '#f8fafc'; // slate-50
  ctx.fillRect(0, 0, width, height);

  // 2. Kartu Utama (Border + Fill)
  const cardX = 30 * scale;
  const cardY = 30 * scale;
  const cardW = width - (60 * scale);
  const cardH = height - (60 * scale);
  const radius = 24 * scale;

  // Helper rounded rect
  const drawRoundRect = (x, y, w, h, r, fillStyle, strokeStyle, lineWidth = 1) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  // Draw Card Background
  drawRoundRect(cardX, cardY, cardW, cardH, radius, '#ffffff', '#e2e8f0', 2 * scale);

  // 3. Header Pita Atas
  const headerH = 95 * scale;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cardX + radius, cardY);
  ctx.lineTo(cardX + cardW - radius, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
  ctx.lineTo(cardX + cardW, cardY + headerH);
  ctx.lineTo(cardX, cardY + headerH);
  ctx.lineTo(cardX, cardY + radius);
  ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
  ctx.closePath();
  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.fill();
  ctx.restore();

  // Header Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${19 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('AUDITMAWA FASILKOM UMB', cardX + (28 * scale), cardY + (40 * scale));

  ctx.fillStyle = '#94a3b8'; // slate-400
  ctx.font = `${11 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('TANDA TERIMA RESMI PENDAFTARAN & KUNCI PEMULIHAN AKUN', cardX + (28 * scale), cardY + (64 * scale));

  // Status Badge di Kanan Atas
  const isApproved = receipt.status === 'approved';
  const badgeText = isApproved ? 'AKUN AKTIF' : 'MENUNGGU ACC DPM';
  const badgeW = isApproved ? (110 * scale) : (145 * scale);
  const badgeH = 28 * scale;
  const badgeX = cardX + cardW - badgeW - (24 * scale);
  const badgeY = cardY + (34 * scale);

  drawRoundRect(
    badgeX, 
    badgeY, 
    badgeW, 
    badgeH, 
    8 * scale, 
    isApproved ? '#065f46' : '#854d0e', // emerald-800 or yellow-800
    isApproved ? '#34d399' : '#fde047', 
    1.5 * scale
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${10 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + (badgeW / 2), badgeY + (18 * scale));
  ctx.textAlign = 'left'; // Reset

  let currentY = cardY + headerH + (30 * scale);

  // 4. KETENTUAN 1: DESKRIPSI TIKET TENTANG APA
  const descBoxX = cardX + (24 * scale);
  const descBoxW = cardW - (48 * scale);
  const descBoxH = 68 * scale;

  drawRoundRect(descBoxX, currentY, descBoxW, descBoxH, 12 * scale, '#eff6ff', '#bfdbfe', 1.5 * scale); // blue-50 border blue-200

  ctx.fillStyle = '#1e40af'; // blue-800
  ctx.font = `bold ${12 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('📌 Tentang Nomor Tiket Ini:', descBoxX + (16 * scale), currentY + (24 * scale));

  ctx.fillStyle = '#1e3a8a'; // blue-900
  ctx.font = `${10.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const line1 = 'Nomor Tiket ini merupakan bukti registrasi sah kepengurusan ormawa di FASILKOM UMB,';
  const line2 = 'sekaligus berfungsi sebagai KUNCI PEMULIHAN RAHASIA jika Anda lupa kata sandi akun.';
  ctx.fillText(line1, descBoxX + (16 * scale), currentY + (42 * scale));
  ctx.fillText(line2, descBoxX + (16 * scale), currentY + (56 * scale));

  currentY += descBoxH + (18 * scale);

  // 5. KETENTUAN 2: BAWAHNYA BARU KODENYA
  const codeBoxH = 82 * scale;
  drawRoundRect(descBoxX, currentY, descBoxW, codeBoxH, 14 * scale, '#f8fafc', '#cbd5e1', 2 * scale); // slate-50 / slate-300

  ctx.fillStyle = '#64748b'; // slate-500
  ctx.font = `bold ${10 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('KODE TIKET & KUNCI PEMULIHAN AKUN', descBoxX + (20 * scale), currentY + (26 * scale));

  // Kode Tiket Besar & Kontras
  ctx.fillStyle = '#2563eb'; // blue-600
  ctx.font = `bold ${24 * scale}px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`;
  ctx.fillText(receipt.ticketNumber || 'REG-ORMAWA-0000', descBoxX + (20 * scale), currentY + (58 * scale));

  currentY += codeBoxH + (26 * scale);

  // 6. RINCIAN DATA IDENTITAS PENGURUS
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold ${13 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('Rincian Data Pendaftaran Pengurus', descBoxX, currentY);

  currentY += 14 * scale;

  // Garis Pembatas
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(descBoxX, currentY);
  ctx.lineTo(descBoxX + descBoxW, currentY);
  ctx.stroke();

  currentY += 20 * scale;

  const rowData = [
    { label: 'Nama Lengkap', value: receipt.name || '-' },
    { label: 'NIM Mahasiswa', value: receipt.nim || '-' },
    { label: 'Lembaga Ormawa', value: receipt.ormawaName || (receipt.ormawaId ? receipt.ormawaId.toUpperCase() : '-') },
    { label: 'Jabatan Kepengurusan', value: receipt.roleName || receipt.role || '-' },
    { label: 'Username Akun', value: `@${receipt.username || '-'}` },
    { label: 'Waktu Pengajuan', value: `${receipt.createdAt || new Date().toLocaleString('id-ID')} WIB` },
  ];

  rowData.forEach((row) => {
    // Label
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = `${11.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(row.label, descBoxX, currentY);

    // Value
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.font = `bold ${12 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(row.value, descBoxX + descBoxW, currentY);
    ctx.textAlign = 'left'; // Reset

    currentY += 28 * scale;
  });

  currentY += 10 * scale;

  // 7. Footer Catatan & Watermark Keamanan
  const footerBoxH = 50 * scale;
  drawRoundRect(descBoxX, currentY, descBoxW, footerBoxH, 10 * scale, '#f1f5f9', '#e2e8f0', 1 * scale);

  ctx.fillStyle = '#475569';
  ctx.font = `${9.5 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('🔒 Dokumen ini sah dan diterbitkan secara digital oleh Dewan Perwakilan Mahasiswa (DPM)', descBoxX + (14 * scale), currentY + (20 * scale));
  ctx.fillText('Fakultas Ilmu Komputer, Universitas Mercu Buana. Simpan gambar ini di galeri perangkat Anda.', descBoxX + (14 * scale), currentY + (36 * scale));

  // 8. Trigger Browser Download
  const cleanNim = (receipt.nim || 'pengurus').replace(/[^a-zA-Z0-9]/g, '');
  const dataUrl = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = `Tanda-Terima-AUDITMAWA-${cleanNim}.png`;
  downloadLink.href = dataUrl;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
