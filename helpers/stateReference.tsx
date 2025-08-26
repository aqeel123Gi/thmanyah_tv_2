import { useRef, useState, useCallback } from "react";

export function getStateReference<T>(initialValue: T): StateReference<T>{

  const [value, setValue] = useState<T>(initialValue);

  const set = setValue;

  const get = () => value;

  return { set, get };

}



export interface StateReference<T> {
  set: (newValue: T) => any;
  get: () => T;
}