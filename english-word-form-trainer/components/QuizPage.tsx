
import React, { useState, useEffect, useCallback } from 'react';
import { getWordsForPage, generateQuestionsForWords, getFormDisplayName } from '../services/wordService';
import type { Question } from '../types';
import { CheckIcon, XIcon } from './icons';

interface QuizPageProps {
  page: number;
}

const QuizPage: React.FC<QuizPageProps> = ({ page }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const initializeQuiz = useCallback(() => {
    const wordsForPage = getWordsForPage(page);
    const generatedQuestions = generateQuestionsForWords(wordsForPage);
    setQuestions(generatedQuestions);
    setUserAnswers(new Array(generatedQuestions.length).fill(''));
    setIsSubmitted(false);
    setScore(0);
  }, [page]);

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = (userAnswer: string, correctAnswer: string | string[]): boolean => {
    const cleanedUserAnswer = userAnswer.trim().toLowerCase();
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(ans => ans.toLowerCase() === cleanedUserAnswer);
    }
    return cleanedUserAnswer === correctAnswer.toLowerCase();
  };
  
  const handleSubmit = () => {
    let currentScore = 0;
    questions.forEach((question, index) => {
      if (checkAnswer(userAnswers[index], question.answer)) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };
  
  if (questions.length === 0) {
      return <div className="text-center p-8">Loading questions...</div>
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300">
      {!isSubmitted ? (
        <div>
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Page {page} - Test Your Knowledge</h2>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center gap-2">
                <label htmlFor={`q-${index}`} className="flex-1 text-slate-600">
                  <span className="font-semibold">{index + 1}.</span> What is the <span className="font-bold text-indigo-600">{getFormDisplayName(q.targetForm)}</span> of "{q.baseWord}" (<span className="italic">{getFormDisplayName(q.baseForm)}</span>)?
                </label>
                <input
                  id={`q-${index}`}
                  type="text"
                  value={userAnswers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={handleSubmit} className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform transform hover:scale-105">
              Check Answers
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">Results for Page {page}</h2>
          <p className="text-center text-xl text-slate-600 mb-8">
            You scored <span className="font-bold text-indigo-600">{score}</span> out of <span className="font-bold">{questions.length}</span>!
          </p>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const isCorrect = checkAnswer(userAnswers[index], q.answer);
              const correctAnswerText = Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer;
              return (
                <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-slate-700 mb-2">
                    <span className="font-semibold">{index + 1}.</span> What is the {getFormDisplayName(q.targetForm)} of "{q.baseWord}"?
                  </p>
                  <div className="flex items-center gap-3">
                    {isCorrect ? <CheckIcon className="text-green-600"/> : <XIcon className="text-red-600"/>}
                    <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      Your answer: <span className="font-normal italic">{userAnswers[index] || '(no answer)'}</span>
                    </p>
                  </div>
                  {!isCorrect && (
                    <p className="mt-1 ml-9 text-slate-600">Correct answer: <span className="font-semibold">{correctAnswerText}</span></p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <button onClick={initializeQuiz} className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-transform transform hover:scale-105">
              Try This Page Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
