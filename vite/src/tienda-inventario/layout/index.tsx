import { useEffect } from 'react';
import { LayoutProvider } from './components/context';
import { Main } from './components/main';

export function DefaultLayout() {
  useEffect(() => {
    document.title = 'Gesven';
  }, []);

  return (
    <>
      <LayoutProvider>
        <Main />
      </LayoutProvider>
    </>
  );
}
