declare module 'react-quill' {
  import * as React from 'react';

  interface QuillOptions {
    debug?: string;
    modules?: Record<string, unknown>;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    formats?: string[];
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    strict?: boolean;
  }

  interface ReactQuillProps extends QuillOptions {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    value?: string;
    defaultValue?: string;
    onChange?: (
      content: string,
      delta: unknown,
      source: string,
      editor: unknown
    ) => void;
    onChangeSelection?: (
      range: unknown,
      source: string,
      editor: unknown
    ) => void;
    onFocus?: (
      range: unknown,
      source: string,
      editor: unknown
    ) => void;
    onBlur?: (
      previousRange: unknown,
      source: string,
      editor: unknown
    ) => void;
    onKeyPress?: React.EventHandler<unknown>;
    onKeyDown?: React.EventHandler<unknown>;
    onKeyUp?: React.EventHandler<unknown>;
    preserveWhitespace?: boolean;
    tabIndex?: number;
  }

  const ReactQuill: React.FC<ReactQuillProps>;
  export default ReactQuill;
}

declare module 'react-quill/dist/quill.snow.css';
