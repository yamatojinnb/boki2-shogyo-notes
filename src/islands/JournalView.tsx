import { yen } from './format';

// アイランド内で使う仕訳表示（Journal.astro と同じ見た目・クラスを共有）
export type JLine = { account: string; amount: number };

type Props = {
  debit: JLine[];
  credit: JLine[];
  caption?: string;
  note?: string;
};

export function JournalView({ debit, credit, caption, note }: Props) {
  const rows = Math.max(debit.length, credit.length);
  return (
    <figure class="journal">
      {caption && <figcaption class="journal-caption">{caption}</figcaption>}
      <table class="journal-table">
        <thead>
          <tr>
            <th class="h-debit" colspan={2} scope="colgroup">借方</th>
            <th class="h-credit" colspan={2} scope="colgroup">貸方</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td class="acct debit">{debit[i]?.account ?? ''}</td>
              <td class="amt debit debit-end">{debit[i] ? yen(debit[i].amount) : ''}</td>
              <td class="acct credit">{credit[i]?.account ?? ''}</td>
              <td class="amt credit">{credit[i] ? yen(credit[i].amount) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <div class="journal-note">{note}</div>}
    </figure>
  );
}
