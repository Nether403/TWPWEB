// components/form-field.tsx
//
// A labelled field row with an optional field-level error message. Shared by
// both Portal-owned forms (contact + funder/invoice) so the error-rendering
// markup lives in one place (Req 17.4).

export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-[0.15em] text-muted"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="font-mono text-xs text-fg">
          {error}
        </p>
      )}
    </div>
  );
}
