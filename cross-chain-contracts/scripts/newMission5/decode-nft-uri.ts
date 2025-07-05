// Usage: ts-node decode-nft-uri.ts '<data:application/json;base64,...>'

import * as fs from 'fs';

function decodeBase64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error(
      'Usage: ts-node decode-nft-uri.ts <data:application/json;base64,...>'
    );
    process.exit(1);
  }

  // Remove prefix
  const base64Json = input.replace(/^data:application\/json;base64,/, '');
  const jsonStr = decodeBase64(base64Json);
  console.log('\nDecoded JSON metadata:\n', jsonStr);

  // Parse JSON and extract image
  let imageField: string;
  try {
    const obj = JSON.parse(jsonStr);
    imageField = obj.image;
    if (!imageField) throw new Error('No image field found');
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    process.exit(1);
  }

  // Remove SVG prefix
  const base64Svg = imageField.replace(/^data:image\/svg\+xml;base64,/, '');
  const svgStr = decodeBase64(base64Svg);
  console.log('\nDecoded SVG:\n', svgStr);

  // Optionally write SVG to file
  fs.writeFileSync('nft_image.svg', svgStr);
  console.log('\nSVG written to nft_image.svg');
}

main();
