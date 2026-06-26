"use client";

import { Spinner } from "@/components/ui/spinner";
import { FieldDescription } from "@/components/ui/field";
import { useMonacoEditor } from "@/hooks/use-monaco-editor";

/**
 * Props for the Monaco-backed starter code editor.
 */
type StarterCodeEditorProps = {
  disabled: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
  value: string;
};

/**
 * Monaco-backed editor field used for starter code input.
 */
export function StarterCodeEditor({
  disabled,
  invalid,
  onChange,
  value,
}: StarterCodeEditorProps) {
  const { containerRef, isReady, loadError } = useMonacoEditor({
    disabled,
    onChange,
    value,
  });

  return (
    <>
      <div
        aria-invalid={invalid}
        className="relative overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
      >
        <div
          ref={containerRef}
          aria-label="Starter code"
          className="h-72 w-full"
          role="textbox"
        />
        {!isReady && !loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Spinner />
          </div>
        ) : null}
      </div>
      {loadError ? (
        <FieldDescription className="text-destructive">
          {loadError}
        </FieldDescription>
      ) : null}
    </>
  );
}
