// From https://stackoverflow.com/a/27232658
// Note that this still returns false on Firefox, but it's better than nothing
export function canUseWebP() {
  if (typeof document === 'undefined') {
    return false;
  }
  var elem = document.createElement('canvas');

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // very old browser like IE 8, canvas not supported
  return false;
}
