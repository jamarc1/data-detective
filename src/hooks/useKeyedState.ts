import { useState } from "react";

/**
 * useState that re-initializes whenever `key` changes, using the
 * render-time reset pattern from the React docs (setState during render
 * of the same component, instead of an effect).
 */
export function useKeyedState<T>(key: string, init: () => T) {
  const [tracked, setTracked] = useState(key);
  const [value, setValue] = useState<T>(init);
  if (key !== tracked) {
    setTracked(key);
    setValue(init());
  }
  return [value, setValue] as const;
}
