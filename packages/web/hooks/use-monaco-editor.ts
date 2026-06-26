"use client";

import { useEffect, useRef, useState } from "react";
import type { editor } from "monaco-editor";

/**
 * Options used to initialize and sync the Monaco editor instance.
 *
 * @property disabled Whether the editor should be read-only.
 * @property language Monaco language identifier to use for the model.
 * @property onChange Callback fired when the editor content changes.
 * @property value Current editor value controlled by React state.
 */
type UseMonacoEditorOptions = {
  disabled: boolean;
  language?: string;
  onChange: (value: string) => void;
  value: string;
};

/**
 * Creates a client-side Monaco editor instance and keeps its content in sync
 * with the calling React state.
 *
 * @param options Editor configuration and change callback.
 * @returns The refs and state needed to render the editor in a component.
 */
export function useMonacoEditor({
  disabled,
  language = "javascript",
  onChange,
  value,
}: UseMonacoEditorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<editor.ITextModel | null>(null);
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);
  const valueRef = useRef(value);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    let disposed = false;
    let subscription: { dispose: () => void } | undefined;

    async function loadEditor() {
      try {
        const monaco = await import("monaco-editor");

        if (disposed || !containerRef.current) {
          return;
        }

        const model = monaco.editor.createModel(valueRef.current, language);
        const codeEditor = monaco.editor.create(containerRef.current, {
          automaticLayout: true,
          fontSize: 13,
          lineNumbers: "on",
          minimap: { enabled: false },
          model,
          padding: { bottom: 12, top: 12 },
          readOnly: disabledRef.current,
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          tabSize: 2,
          theme: "vs",
          wordWrap: "on",
        });

        subscription = model.onDidChangeContent(() => {
          onChangeRef.current(model.getValue());
        });
        editorRef.current = codeEditor;
        modelRef.current = model;
        setIsReady(true);
      } catch {
        if (!disposed) {
          setLoadError("Impossible de charger l'editeur Monaco.");
        }
      }
    }

    loadEditor();

    return () => {
      disposed = true;
      subscription?.dispose();
      editorRef.current?.dispose();
      modelRef.current?.dispose();
    };
  }, [language]);

  useEffect(() => {
    const model = modelRef.current;

    if (model && value !== model.getValue()) {
      model.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    editorRef.current?.updateOptions({ readOnly: disabled });
  }, [disabled]);

  return { containerRef, isReady, loadError };
}
