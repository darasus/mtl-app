import React from "react";

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T | undefined>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
