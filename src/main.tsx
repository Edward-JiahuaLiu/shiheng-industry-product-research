import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Demo from './Demo';
import Report from './Report';
import './styles.css';

function Site() {
  const [page, setPage] = useState(window.location.hash === '#report' ? 'report' : 'demo');
  useEffect(() => {
    const onHashChange = () => setPage(window.location.hash === '#report' ? 'report' : 'demo');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    document.title = page === 'report'
      ? '食亨行业与产品研究｜刘嘉骅'
      : '厨房知识问答 Demo｜食亨产品研究';
  }, [page]);
  return page === 'report' ? <Report /> : <Demo />;
}

createRoot(document.getElementById('root')!).render(<Site />);
