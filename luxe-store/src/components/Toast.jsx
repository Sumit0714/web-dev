import { useSelector } from 'react-redux';

function Toast() {
  const toast = useSelector(state => state.ui.toast);
  return <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>;
}

export default Toast;
