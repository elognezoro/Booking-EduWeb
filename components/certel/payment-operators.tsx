/** Moyens de paiement acceptés via la passerelle CinetPay (présentationnel). */
export const PAYMENT_OPERATORS: { name: string; color: string }[] = [
  { name: "Orange Money", color: "#FF7900" },
  { name: "Moov Money", color: "#1C9CD8" },
  { name: "MTN Money", color: "#FFCC00" },
  { name: "Wave", color: "#1DC8FF" },
  { name: "CinetPay", color: "#16A085" },
];

export function PaymentOperators({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {PAYMENT_OPERATORS.map((o) => (
        <span key={o.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: o.color }} />
          {o.name}
        </span>
      ))}
    </div>
  );
}
