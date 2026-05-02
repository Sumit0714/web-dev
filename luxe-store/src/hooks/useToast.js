import { useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setToast } from '../store/uiSlice';

export function useToast() {
  const dispatch = useDispatch();
  const timer = useRef(null);

  const showToast = useCallback((msg) => {
    dispatch(setToast(msg));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch(setToast('')), 2400);
  }, [dispatch]);

  return showToast;
}
