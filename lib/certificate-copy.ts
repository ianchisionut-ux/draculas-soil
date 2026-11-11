export function digitalCertificateCopy(value: string): string {
  return value.replace(/\b(?:signed |digital )?certificate of authenticity\b/gi, (match) =>
    match[0] === match[0].toUpperCase()
      ? "Digital certificate of authenticity"
      : "digital certificate of authenticity",
  );
}
