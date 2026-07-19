import { useMemo, useState } from 'preact/hooks';
import { base } from '../lib/site';

export type HighlightColor = 'blue' | 'green' | 'amber' | 'rose' | 'purple';

export interface GuidedStep {
  tag: string;
  body: string;
  highlights: string[];
  highlightColor: HighlightColor;
  journalGlow: { id: string; color: HighlightColor }[];
}

export interface GuidedJournalCell {
  account: string;
  amount: string;
}

export interface GuidedJournalRow {
  debit: GuidedJournalCell | null;
  credit: GuidedJournalCell | null;
}

export interface GuidedProblemSegment {
  id: string;
  text: string;
  isHighlightable: boolean;
}

export interface GuidedRelatedLesson {
  slug: string;
  title: string;
}

interface Props {
  questionNumber: string;
  questionTitle: string;
  points: number;
  problemSegments: GuidedProblemSegment[];
  journal: GuidedJournalRow[];
  steps: GuidedStep[];
  relatedLesson?: GuidedRelatedLesson;
}

export default function GuidedExplanation({
  questionNumber,
  questionTitle,
  points,
  problemSegments,
  journal,
  steps,
  relatedLesson,
}: Props) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const highlightSet = useMemo(() => new Set(step.highlights), [step]);
  const glowMap = useMemo(() => {
    const m = new Map<string, HighlightColor>();
    step.journalGlow.forEach((g) => m.set(g.id, g.color));
    return m;
  }, [step]);

  const next = () => setCurrent((c) => (c === steps.length - 1 ? 0 : c + 1));
  const prev = () => setCurrent((c) => Math.max(0, c - 1));

  return (
    <section class="guided" aria-label={`${questionNumber} ガイド付き解説`}>
      <div class="guided-head">
        <span class="guided-qno">{questionNumber}</span>
        <span class="guided-qtitle">{questionTitle}</span>
        <span class="guided-pts">{points}点</span>
      </div>

      <p class="guided-problem">
        {problemSegments.map((seg) =>
          seg.isHighlightable && highlightSet.has(seg.id) ? (
            <span key={seg.id} class={`hl hl-${step.highlightColor}`}>
              {seg.text}
            </span>
          ) : (
            <span key={seg.id}>{seg.text}</span>
          )
        )}
      </p>

      <div class="guided-arrow" aria-hidden="true">
        <i class="ti ti-arrow-down" />
      </div>

      <div class="guided-journal-wrap">
        <table class="guided-journal">
          <thead>
            <tr>
              <th class="h-debit" colspan={2}>
                借方
              </th>
              <th class="h-credit" colspan={2}>
                貸方
              </th>
            </tr>
          </thead>
          <tbody>
            {journal.map((row, i) => {
              const dColor = glowMap.get(`d${i}`);
              const cColor = glowMap.get(`c${i}`);
              return (
                <tr key={i}>
                  <td class={`gj-acct gj-debit${dColor ? ` glow-${dColor}` : ''}`}>
                    {row.debit?.account ?? ''}
                  </td>
                  <td class={`gj-amt gj-debit${dColor ? ` glow-${dColor}` : ''} amt`}>
                    {row.debit?.amount ?? ''}
                  </td>
                  <td class={`gj-acct gj-credit${cColor ? ` glow-${cColor}` : ''}`}>
                    {row.credit?.account ?? ''}
                  </td>
                  <td class={`gj-amt gj-credit${cColor ? ` glow-${cColor}` : ''} amt`}>
                    {row.credit?.amount ?? ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="guided-arrow" aria-hidden="true">
        <i class="ti ti-arrow-down" />
      </div>

      <div class="guided-panel">
        <div class="guided-step-tag">{step.tag}</div>
        <div class="guided-step-body" dangerouslySetInnerHTML={{ __html: step.body }} />
      </div>

      <div class="guided-nav">
        <button type="button" class="guided-nav-btn" onClick={prev} disabled={current === 0}>
          <i class="ti ti-chevron-left" aria-hidden="true" /> 前へ
        </button>
        <div class="guided-dots" role="group" aria-label="ステップ選択">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              class={`guided-dot${i === current ? ' is-active' : ''}`}
              aria-label={`ステップ${i + 1}`}
              aria-current={i === current}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
        <button type="button" class="guided-nav-btn primary" onClick={next}>
          {isLast ? '最初に戻る' : '次へ'} <i class="ti ti-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {relatedLesson && (
        <div class="related-box">
          関連知識：<a href={`${base}lessons/${relatedLesson.slug}/`}>{relatedLesson.title}</a>
        </div>
      )}
    </section>
  );
}
