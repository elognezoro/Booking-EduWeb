export function DocumentQRCode({ documentId, size = 160 }: { documentId: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/documents/${documentId}/qrcode`}
      alt="QR code du document"
      width={size}
      height={size}
      className="rounded-xl border border-border bg-white p-2"
    />
  );
}
