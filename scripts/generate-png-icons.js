import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  table[i] = c >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  const cx = width / 2;
  const cy = height / 2;
  const r = width * (isMaskable ? 0.48 : 0.44);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter byte None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default outer canvas
      let rVal = 27, gVal = 42, bVal = 74, aVal = 255; // #1b2a4a

      if (isMaskable) {
        // Full bleed gradient
        rVal = Math.round(20 + (x / width) * 15);
        gVal = Math.round(33 + (y / height) * 45);
        bVal = Math.round(58 + (x / width) * 100);
      } else {
        // Rounded corner rect
        const cr = width * 0.22;
        const qx = Math.abs(x - cx) - (cx - cr);
        const qy = Math.abs(y - cy) - (cy - cr);
        const cornerDist = Math.hypot(Math.max(0, qx), Math.max(0, qy));
        if (cornerDist > cr) {
          aVal = 0; // transparent outside rounded squircle
        }
      }

      if (aVal > 0) {
        // Inner card window
        const cardW = width * 0.72;
        const cardH = height * 0.68;
        const cardL = cx - cardW / 2;
        const cardR = cx + cardW / 2;
        const cardT = cy - cardH / 2;
        const cardB = cy + cardH / 2;

        if (x >= cardL && x <= cardR && y >= cardT && y <= cardB) {
          // Inner card background
          rVal = 11; gVal = 19; bVal = 41; // #0b1329

          // Header bar of card
          if (y <= cardT + cardH * 0.16) {
            rVal = 30; gVal = 58; bVal = 100;
          }

          // Middle SAP Blue badge
          const bW = cardW * 0.65;
          const bH = cardH * 0.28;
          const bL = cx - bW / 2;
          const bR = cx + bW / 2;
          const bT = cy - cardH * 0.18;
          const bB = bT + bH;
          if (x >= bL && x <= bR && y >= bT && y <= bB) {
            rVal = 0; gVal = 112; bVal = 242; // #0070f2
          }

          // Amber ABAP stripe
          const sW = cardW * 0.55;
          const sH = cardH * 0.14;
          const sL = cx - sW / 2;
          const sR = cx + sW / 2;
          const sT = bB + cardH * 0.08;
          const sB = sT + sH;
          if (x >= sL && x <= sR && y >= sT && y <= sB) {
            rVal = 245; gVal = 158; bVal = 11; // #f59e0b
          }

          // Asterisk circle badge in top right of card
          const astX = cardR - cardW * 0.12;
          const astY = cardT + cardH * 0.28;
          const astR = cardW * 0.1;
          const distAst = Math.hypot(x - astX, y - astY);
          if (distAst <= astR) {
            rVal = 245; gVal = 158; bVal = 11;
          }
        }
      }

      rawData[offset++] = rVal;
      rawData[offset++] = gVal;
      rawData[offset++] = bVal;
      rawData[offset++] = aVal;
    }
  }

  // Header chunk (IHDR)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const compressed = zlib.deflateSync(rawData);

  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, false));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, false));
fs.writeFileSync('public/favicon.png', createPng(64, 64, false));
console.log('PWA PNG icons generated successfully!');
