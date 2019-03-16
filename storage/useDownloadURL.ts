import { storage } from 'firebase';
import { useEffect } from 'react';
import { useComparatorRef, useLoadingValue } from '../util';

export type DownloadURLHook = {
  error?: object;
  loading: boolean;
  value?: string;
};

export default (storageRef: storage.Reference | null | undefined): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string
  >();
  function isEqual(v1: storage.Reference | null | undefined, v2: storage.Reference | null | undefined): boolean {
    const bothNull: boolean = !v1 && !v2;
    const equal: boolean = !!v1 && !!v2 && v1.fullPath === v2.fullPath;
    return bothNull || equal;
  }
  const ref = useComparatorRef(storageRef, isEqual, reset);

  useEffect(
    () => {
      if (!ref.current) return;
      ref.current
        .getDownloadURL()
        .then(setValue)
        .catch(setError);
    },
    [ref.current]
  );

  return {
    error,
    loading,
    value,
  };
};
