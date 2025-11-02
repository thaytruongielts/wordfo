
import React, { useState } from 'react';
import QuizPage from './components/QuizPage';
import Pagination from './components/Pagination';
import { TOTAL_PAGES } from './services/wordService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">English Word Form Trainer</h1>
        <p className="text-slate-600 mt-2 text-lg">Practice your vocabulary for the Grade 10 exam.</p>
      </header>
      <main className="w-full max-w-4xl">
        <QuizPage key={currentPage} page={currentPage} />
      </main>
      <footer className="w-full max-w-4xl mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </footer>
    </div>
  );
};

export default App;
