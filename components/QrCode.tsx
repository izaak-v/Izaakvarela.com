import QRCode from "qrcode";

/**
 * QR code rendered to inline SVG at build time (no third-party service, no tracking).
 * `value` should be the clean public URL.
 */
export async function QrCode({
  value,
  label,
  size = 152,
}: {
  value: string;
  label: string;
  size?: number;
}) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#111214", light: "#ffffff" },
  });
  return (
    <div
      className="qr"
      role="img"
      aria-label={label}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{
        __html: svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" '),
      }}
    />
  );
}
