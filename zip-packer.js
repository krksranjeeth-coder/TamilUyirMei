/**
 * SimpleZipWriter
 * Lightweight, zero-dependency PKZIP generator in pure JavaScript (Browser & Node.js).
 * Fully supports UTF-8 filenames (Tamil unicode) via PKZIP bit 11 flag.
 */

class SimpleZipWriter {
  constructor() {
    this.files = [];
    this.textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
    this.crcTable = SimpleZipWriter.makeCrcTable();
  }

  static makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  }

  crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  encodeUtf8(str) {
    if (this.textEncoder) {
      return this.textEncoder.encode(str);
    }
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(str, 'utf8'));
    }
    // Fallback URI encode
    const binary = unescape(encodeURIComponent(str));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Add a file to the ZIP
   * @param {string} path - E.g. '01_க்_ik/க.gif'
   * @param {Uint8Array|ArrayBuffer|string} data - Binary content or string
   */
  addFile(path, data) {
    let bytes;
    if (typeof data === 'string') {
      bytes = this.encodeUtf8(data);
    } else if (data instanceof Uint8Array) {
      bytes = data;
    } else if (data instanceof ArrayBuffer) {
      bytes = new Uint8Array(data);
    } else if (data && data.buffer) {
      bytes = new Uint8Array(data.buffer);
    } else {
      bytes = new Uint8Array(0);
    }

    this.files.push({
      path: path.replace(/\\/g, '/'),
      bytes: bytes
    });
  }

  build() {
    const localHeaders = [];
    const cdHeaders = [];
    let offset = 0;

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const nameBytes = this.encodeUtf8(file.path);
      const crc = this.crc32(file.bytes);
      const size = file.bytes.length;

      // 1. Local File Header (30 bytes + name length)
      const lhBuf = new ArrayBuffer(30 + nameBytes.length);
      const lhView = new DataView(lhBuf);
      lhView.setUint32(0, 0x04034b50, true); // Local file header signature
      lhView.setUint16(4, 10, true);         // Version needed to extract (1.0)
      lhView.setUint16(6, 0x0800, true);     // General purpose bit flag (bit 11 = UTF-8)
      lhView.setUint16(8, 0, true);          // Compression method: 0 (Store/Uncompressed)
      lhView.setUint16(10, 0, true);         // Last mod file time
      lhView.setUint16(12, 0, true);         // Last mod file date
      lhView.setUint32(14, crc, true);       // CRC-32
      lhView.setUint32(18, size, true);      // Compressed size
      lhView.setUint32(22, size, true);      // Uncompressed size
      lhView.setUint16(26, nameBytes.length, true); // File name length
      lhView.setUint16(28, 0, true);         // Extra field length

      const lhBytes = new Uint8Array(lhBuf);
      lhBytes.set(nameBytes, 30);

      localHeaders.push(lhBytes);
      localHeaders.push(file.bytes);

      // 2. Central Directory Header (46 bytes + name length)
      const cdBuf = new ArrayBuffer(46 + nameBytes.length);
      const cdView = new DataView(cdBuf);
      cdView.setUint32(0, 0x02014b50, true); // Central file header signature
      cdView.setUint16(4, 20, true);         // Version made by (2.0)
      cdView.setUint16(6, 10, true);         // Version needed to extract (1.0)
      cdView.setUint16(8, 0x0800, true);     // General purpose bit flag (UTF-8)
      cdView.setUint16(10, 0, true);         // Compression method: 0
      cdView.setUint16(12, 0, true);         // Last mod file time
      cdView.setUint16(14, 0, true);         // Last mod file date
      cdView.setUint32(16, crc, true);       // CRC-32
      cdView.setUint32(20, size, true);      // Compressed size
      cdView.setUint32(24, size, true);      // Uncompressed size
      cdView.setUint16(28, nameBytes.length, true); // File name length
      cdView.setUint16(30, 0, true);         // Extra field length
      cdView.setUint16(32, 0, true);         // File comment length
      cdView.setUint16(34, 0, true);         // Disk number start
      cdView.setUint16(36, 0, true);         // Internal file attributes
      cdView.setUint32(38, 0, true);         // External file attributes
      cdView.setUint32(42, offset, true);    // Relative offset of local header

      const cdBytes = new Uint8Array(cdBuf);
      cdBytes.set(nameBytes, 46);

      cdHeaders.push(cdBytes);

      offset += lhBytes.length + file.bytes.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (let h of cdHeaders) cdSize += h.length;

    // 3. End of Central Directory Record (22 bytes)
    const eocdBuf = new ArrayBuffer(22);
    const eocdView = new DataView(eocdBuf);
    eocdView.setUint32(0, 0x06054b50, true); // EOCD signature
    eocdView.setUint16(4, 0, true);          // Number of this disk
    eocdView.setUint16(6, 0, true);          // Disk where central directory starts
    eocdView.setUint16(8, this.files.length, true);  // Number of central directory records on this disk
    eocdView.setUint16(10, this.files.length, true); // Total number of central directory records
    eocdView.setUint32(12, cdSize, true);    // Size of central directory
    eocdView.setUint32(16, cdOffset, true);  // Offset of start of central directory
    eocdView.setUint16(20, 0, true);         // Comment length

    const eocdBytes = new Uint8Array(eocdBuf);

    // Calculate total size
    let totalLength = 0;
    for (let part of localHeaders) totalLength += part.length;
    for (let part of cdHeaders) totalLength += part.length;
    totalLength += eocdBytes.length;

    // Allocate final contiguous buffer
    const finalBuffer = new Uint8Array(totalLength);
    let curOffset = 0;

    for (let part of localHeaders) {
      finalBuffer.set(part, curOffset);
      curOffset += part.length;
    }
    for (let part of cdHeaders) {
      finalBuffer.set(part, curOffset);
      curOffset += part.length;
    }
    finalBuffer.set(eocdBytes, curOffset);

    return finalBuffer;
  }

  toBlob() {
    const bytes = this.build();
    return new Blob([bytes], { type: 'application/zip' });
  }
}

// Universal export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleZipWriter;
}
if (typeof window !== 'undefined') {
  window.SimpleZipWriter = SimpleZipWriter;
}
