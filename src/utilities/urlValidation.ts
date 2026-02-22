/**
 * Validates if a URL is safe to use in an href attribute.
 * Only allows http: and https: protocols to prevent XSS (e.g., javascript: URIs).
 *
 * @param url The URL to validate
 * @returns A safe URL or an empty string if invalid
 */
export const getSafeUrl = (url: string | undefined | null): string => {
  if (!url) return '';

  const trimmedUrl = url.trim();

  // Check if it's a relative path or starts with http:// or https://
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // If it doesn't have a protocol, we could assume it might be a domain or path
  // but to be safe as per the review, we should strictly require http/https
  // or at least block javascript: and other dangerous protocols.

  const protocolRegex = /^[a-z][a-z0-9.+-]*:/i;
  const match = protocolRegex.exec(trimmedUrl);

  if (match) {
    const protocol = match[0].toLowerCase();
    if (protocol !== 'http:' && protocol !== 'https:') {
      console.warn(`Blocked potentially unsafe URL protocol: ${protocol}`);
      return '';
    }
  }

  return trimmedUrl;
};
