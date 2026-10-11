/**
 * Lightweight, zero-dependency GIF89a Animated GIF Encoder in Pure JavaScript
 * Handles palette generation, LZW compression, frame delays, and binary Blob generation.
 */

class SimpleGifEncoder {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.frames = [];
    this.repeat = 0; // 0 = loop forever
    this.delay = 30; // default delay in hundredths of a second (300ms)
    this.quality = 10; // color sampling
  }

  setDelay(ms) {
    this.delay = Math.round(ms / 10);
  }

  setRepeat(repeat) {
    this.repeat = repeat;
  }

  addFrame(ctx, delayMs) {
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    this.frames.push({
      data: imageData.data,
      delay: delayMs ? Math.round(delayMs / 10) : this.delay
    });
  }

  // Quantize 24-bit RGBA to a clean 256-color palette (RGB 6x6x6 color cube + grayscale + custom accents)
  buildPalette() {
    const palette = [];
    // 6x6x6 color cube = 216 colors
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          palette.push([
            Math.round(r * 255 / 5),
            Math.round(g * 255 / 5),
            Math.round(b * 255 / 5)
          ]);
        }
      }
    }
    // Grayscale ramp 24 shades
    for (let i = 0; i < 24; i++) {
      const v = Math.round(i * 255 / 23);
      palette.push([v, v, v]);
    }
    // Specific rich vibrant colors for children educational app
    const extras = [
      [255, 107, 107], [255, 159, 67], [254, 202, 87], [29, 209, 161],
      [72, 219, 251], [10, 189, 227], [84, 160, 255], [95, 39, 205],
      [255, 159, 243], [243, 104, 224], [255, 71, 87], [255, 234, 167],
      [223, 230, 233], [99, 110, 114], [45, 52, 54], [0, 0, 0]
    ];
    for (let c of extras) {
      if (palette.length < 256) palette.push(c);
    }
    while (palette.length < 256) {
      palette.push([0, 0, 0]);
    }
    return palette;
  }

  // Find nearest color in palette
  getNearestColorIndex(r, g, b, palette) {
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < palette.length; i++) {
      const pr = palette[i][0];
      const pg = palette[i][1];
      const pb = palette[i][2];
      const dr = r - pr;
      const dg = g - pg;
      const db = b - pb;
      const dist = dr * dr * 2 + dg * dg * 4 + db * db * 3;
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
        if (dist === 0) break;
      }
    }
    return bestIdx;
  }

  // LZW Compression for GIF
  lzwCompress(indices, colorDepth) {
    const initCodeSize = Math.max(2, colorDepth);
    const clearCode = 1 << initCodeSize;
    const eoiCode = clearCode + 1;

    let codeSize = initCodeSize + 1;
    let maxCode = (1 << codeSize) - 1;
    let nextCode = eoiCode + 1;

    let dictionary = new Map();
    function resetDict() {
      dictionary.clear();
      for (let i = 0; i < clearCode; i++) {
        dictionary.set(String(i), i);
      }
    }
    resetDict();

    const outputCodes = [];
    outputCodes.push(clearCode);

    if (indices.length === 0) {
      outputCodes.push(eoiCode);
      return { outputCodes, initCodeSize };
    }

    let prefix = String(indices[0]);

    for (let i = 1; i < indices.length; i++) {
      const k = indices[i];
      const prefixK = prefix + "," + k;

      if (dictionary.has(prefixK)) {
        prefix = prefixK;
      } else {
        outputCodes.push(dictionary.get(prefix));

        if (nextCode <= 4095) {
          dictionary.set(prefixK, nextCode++);
        }

        if (nextCode > maxCode && codeSize < 12) {
          codeSize++;
          maxCode = (1 << codeSize) - 1;
        } else if (nextCode > 4095) {
          outputCodes.push(clearCode);
          resetDict();
          codeSize = initCodeSize + 1;
          maxCode = (1 << codeSize) - 1;
          nextCode = eoiCode + 1;
        }

        prefix = String(k);
      }
    }

    if (prefix !== "") {
      outputCodes.push(dictionary.get(prefix));
    }
    outputCodes.push(eoiCode);

    return { outputCodes, initCodeSize };
  }

  // Pack variable bit length codes into bytes
  packCodes(outputCodes, initCodeSize) {
    const bytes = [];
    let curByte = 0;
    let curBits = 0;

    let codeSize = initCodeSize + 1;
    const clearCode = 1 << initCodeSize;
    const eoiCode = clearCode + 1;
    let nextCode = eoiCode + 1;

    for (let i = 0; i < outputCodes.length; i++) {
      const code = outputCodes[i];

      // pack code
      curByte |= (code << curBits);
      curBits += codeSize;

      while (curBits >= 8) {
        bytes.push(curByte & 0xFF);
        curByte >>= 8;
        curBits -= 8;
      }

      if (code === clearCode) {
        codeSize = initCodeSize + 1;
        nextCode = eoiCode + 1;
      } else if (code === eoiCode) {
        // finished
      } else {
        nextCode++;
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      }
    }

    if (curBits > 0) {
      bytes.push(curByte & 0xFF);
    }

    return bytes;
  }

  // Render to binary GIF Uint8Array
  render() {
    const out = [];
    const w = this.width;
    const h = this.height;

    // 1. Header: 'GIF89a'
    const header = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
    out.push(...header);

    // 2. Logical Screen Descriptor
    out.push(w & 0xFF, (w >> 8) & 0xFF);
    out.push(h & 0xFF, (h >> 8) & 0xFF);

    // GCT Flag = 1, Color Res = 7 (8 bits), Sort = 0, GCT Size = 7 (256 colors) -> 0xF7
    out.push(0xF7);
    out.push(0); // background color index
    out.push(0); // pixel aspect ratio

    // 3. Global Color Table (256 colors * 3 bytes = 768 bytes)
    const palette = this.buildPalette();
    for (let c of palette) {
      out.push(c[0], c[1], c[2]);
    }

    // 4. Netscape 2.0 Loop Extension
    if (this.repeat >= 0) {
      out.push(0x21, 0xFF, 0x0B); // Ext header
      const netscape = [0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30];
      out.push(...netscape);
      out.push(0x03, 0x01);
      out.push(this.repeat & 0xFF, (this.repeat >> 8) & 0xFF);
      out.push(0x00); // Block terminator
    }

    // Pre-build color lookup cache for speed
    const colorCache = new Map();

    // 5. Each Frame
    for (let frame of this.frames) {
      // Graphics Control Extension
      out.push(0x21, 0xF9, 0x04);
      out.push(0x04); // Disposal method: 1 (do not dispose / overwrite)
      out.push(frame.delay & 0xFF, (frame.delay >> 8) & 0xFF);
      out.push(0x00); // Transparent color index
      out.push(0x00); // Block terminator

      // Image Descriptor
      out.push(0x2C);
      out.push(0, 0, 0, 0); // x=0, y=0
      out.push(w & 0xFF, (w >> 8) & 0xFF);
      out.push(h & 0xFF, (h >> 8) & 0xFF);
      out.push(0x00); // No Local Color Table, not interlaced

      // Quantize frame data to palette indices
      const data = frame.data;
      const numPixels = w * h;
      const indices = new Uint8Array(numPixels);

      for (let i = 0; i < numPixels; i++) {
        const offset = i * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const key = (r << 16) | (g << 8) | b;
        let idx = colorCache.get(key);
        if (idx === undefined) {
          idx = this.getNearestColorIndex(r, g, b, palette);
          colorCache.set(key, idx);
        }
        indices[i] = idx;
      }

      // LZW Compress
      const lzwResult = this.lzwCompress(indices, 8);
      const packedBytes = this.packCodes(lzwResult.outputCodes, lzwResult.initCodeSize);

      // Write initial code size
      out.push(lzwResult.initCodeSize);

      // Write sub-blocks (max 255 bytes each)
      let offset = 0;
      while (offset < packedBytes.length) {
        const blockSize = Math.min(255, packedBytes.length - offset);
        out.push(blockSize);
        for (let b = 0; b < blockSize; b++) {
          out.push(packedBytes[offset + b]);
        }
        offset += blockSize;
      }
      out.push(0x00); // Sub-block terminator
    }

    // 6. GIF Trailer
    out.push(0x3B);

    return new Uint8Array(out);
  }

  // Get Blob
  toBlob() {
    const bytes = this.render();
    return new Blob([bytes], { type: 'image/gif' });
  }
}

// Export for window or Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleGifEncoder;
}
if (typeof window !== 'undefined') {
  window.SimpleGifEncoder = SimpleGifEncoder;
}
