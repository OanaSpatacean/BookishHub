import React from "react"

export function debounceSave(value: string, delay: number) 
{
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay])

  return debouncedValue
}
