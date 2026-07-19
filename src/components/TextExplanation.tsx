import { useState } from 'preact/hooks';
import { base } from '../lib/site';

export interface TextExplanationJournalCell {
  account: string;
  amount: string;
}

export interface TextExplanationJournalRow {
  debit: TextExplanationJournalCell | null;
  credit: TextExplanationJournalCell | null;
}

export interface TextExplanationRelatedLesson {
  slug: string;
  title: string;
}

interface Props {
  steps: string[];
  journal: TextExplanationJournalRow[];
  supplement: string;
  mistakes: string;
  relatedLesson?: TextExplanationRelatedLesson;
}

export default function TextExplanation({ steps, journal, supplement, mistakes, relatedLesson }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div class="text-expl">
      <button
        type="button"
        class="text-expl-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <i class={`ti ${open ? 'ti-chevron-down' : 'ti-chevron-right'}`} aria-hidden="true" />
        {open ? 'テキスト解説を閉じる' : 'テキスト解説を表示'}
      </button>

      <div class={`text-expl-panel${open ? ' is-open' : ''}`}>
        <div class="text-expl-inner">
          <ol class="steps">
            {steps.map((s, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: s }} />
            ))}
          </ol>

          <figure class="journal">
            <table class="journal-table">
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
                {journal.map((row, i) => (
                  <tr key={i}>
                    <td class="acct debit">{row.debit?.account ?? ''}</td>
                    <td class="amt debit debit-end">{row.debit?.amount ?? ''}</td>
                    <td class="acct credit">{row.credit?.account ?? ''}</td>
                    <td class="amt credit">{row.credit?.amount ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>

          <div class="text-expl-supplement" dangerouslySetInnerHTML={{ __html: supplement }} />

          <div class="point">
            <span class="point-label">POINT</span>
            <div class="point-body">
              <p>{mistakes}</p>
            </div>
          </div>

          {relatedLesson && (
            <div class="related-box">
              関連知識：<a href={`${base}lessons/${relatedLesson.slug}/`}>{relatedLesson.title}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
