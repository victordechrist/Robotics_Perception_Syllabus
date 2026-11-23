'use client';

import { useMemo, useState } from 'react';
import { emitActivity } from '@/lib/activity';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { quizScoreKey } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/data/testQuiz';

interface QuizPanelProps {
  labSlug: string;
  questions: QuizQuestion[];
}

/**
 * Auto-graded cumulative quiz for the test lab. Single-answer MCQs with
 * instant feedback; the best score persists in localStorage and every answer
 * emits an activity event. Retakes are allowed — the best score is kept.
 */
export function QuizPanel({ labSlug, questions }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const { value: storedBest, setValue: setStoredBest } = useLocalStorage<number | null>(
    quizScoreKey(labSlug),
    null,
  );

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () => questions.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0),
    [answers, questions],
  );
  const finished = answeredCount === questions.length;

  const pick = (q: QuizQuestion, optionIndex: number) => {
    if (revealed[q.id]) return;
    const correct = optionIndex === q.answer;
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
    emitActivity('quiz.question.answer', {
      labSlug,
      data: { questionId: q.id, topic: q.topic, correct },
    });
    if (Object.keys(answers).length + 1 === questions.length) {
      const finalScore =
        questions.reduce((n, qq) => n + ((qq.id === q.id ? optionIndex : answers[qq.id]) === qq.answer ? 1 : 0), 0);
      const newBest = Math.max(storedBest ?? 0, finalScore);
      setStoredBest(newBest);
      emitActivity('quiz.complete', {
        labSlug,
        data: { score: finalScore, total: questions.length, best: newBest },
      });
    }
  };

  const reset = () => {
    setAnswers({});
    setRevealed({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {questions.length} questions covering the last four labs. Answer all to see your score — retakes keep your best.
        </p>
        <div className="ml-auto flex items-center gap-2">
          {storedBest != null && (
            <Badge variant="secondary" className="text-xs">
              Best: {storedBest}/{questions.length}
            </Badge>
          )}
          {finished && (
            <Badge
              variant={score === questions.length ? 'default' : 'secondary'}
              className="text-xs"
            >
              Score: {score}/{questions.length}
            </Badge>
          )}
          {finished && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retake
            </Button>
          )}
        </div>
      </div>

      {questions.map((q, qi) => {
        const chosen = answers[q.id];
        const isRevealed = Boolean(revealed[q.id]);
        return (
          <div
            key={q.id}
            className={cn(
              'rounded-lg border p-4',
              isRevealed && chosen === q.answer
                ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                : isRevealed
                  ? 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'
                  : 'border-border',
            )}
          >
            <div className="mb-2 flex items-start gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Q{qi + 1}</span>
              <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
            </div>
            <p className="mb-3 text-sm font-medium">{q.question}</p>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const isCorrect = oi === q.answer;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => pick(q, oi)}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                      !isRevealed && 'hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20',
                      isRevealed && isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
                      isRevealed && isChosen && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                      isRevealed && !isChosen && !isCorrect && 'opacity-60',
                    )}
                  >
                    {isRevealed && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                    {isRevealed && isChosen && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {isRevealed && (
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold">Why: </span>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
