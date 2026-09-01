export const BRAND = Object.freeze({
  CORAL: 'coral',
  SUNMAR: 'sunmar',
});

export function detectBrand(hostname = globalThis.location?.hostname ?? '') {
  const host = String(hostname).toLowerCase();

  if (host.includes('coral')) return BRAND.CORAL;
  if (host.includes('sunmar')) return BRAND.SUNMAR;

  return null;
}

export function getDisplayBrand() {
  return detectBrand() ?? BRAND.CORAL;
}
