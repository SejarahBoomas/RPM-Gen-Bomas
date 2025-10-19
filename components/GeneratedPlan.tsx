import React from 'react';

interface GeneratedPlanProps {
  planText: string;
}

// A markdown-like parser to render the AI's response with specific styling.
// It handles headings, lists, bold text, a special phrase, and markdown tables.
const parseAndRender = (text: string) => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Table Detection
    const isTableLine = trimmedLine.startsWith('|') && trimmedLine.endsWith('|');
    const isSeparatorLine = (l: string) => l.trim().startsWith('|') && /\|-*:?--*:?\|/.test(l.trim());

    if (isTableLine && i + 1 < lines.length && isSeparatorLine(lines[i + 1])) {
      const headerLine = trimmedLine;
      const headerCells = headerLine.split('|').slice(1, -1).map(h => h.trim());
      const tableHeaders = headerCells.map((header, hIndex) => (
        <th key={`th-${i}-${hIndex}`} scope="col" className="px-6 py-3 border border-slate-300 bg-slate-100 font-semibold">{header}</th>
      ));

      const tableRows: React.ReactNode[] = [];
      i += 2; // Move past header and separator

      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const rowLine = lines[i].trim();
        const cells = rowLine.split('|').slice(1, -1).map(c => c.trim());
        const row = cells.map((cell, cIndex) => (
          <td key={`td-${i}-${cIndex}`} className="px-6 py-4 border border-slate-300" dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>').replace(/\n/g, '<br/>') }}/>
        ));
        tableRows.push(<tr key={`tr-${i}`} className="bg-white even:bg-slate-50">{row}</tr>);
        i++;
      }

      elements.push(
        <div key={`table-wrapper-${elements.length}`} className="overflow-x-auto my-6 border border-slate-300 rounded-lg shadow-sm">
          <table key={`table-${elements.length}`} className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase">
              <tr>{tableHeaders}</tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // List Detection
    if (trimmedLine.startsWith('- ')) {
        const listItems: React.ReactNode[] = [];
        let listStartIndex = i;
        while(i < lines.length && lines[i].trim().startsWith('- ')) {
            const itemText = lines[i].trim().substring(2);
            const renderedItem = itemText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
            listItems.push(<li key={`li-${i}`} dangerouslySetInnerHTML={{ __html: renderedItem }} />);
            i++;
        }
        elements.push(<ul key={`ul-${listStartIndex}`} className="list-disc space-y-2 pl-6 mb-4">{listItems}</ul>);
        continue;
    }

    // Other elements
    if (trimmedLine.startsWith('### ')) {
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-extrabold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 mt-6 first:mt-0">{trimmedLine.substring(4)}</h2>);
    } else if (trimmedLine.startsWith('#### ')) {
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-bold text-blue-700 mb-3 mt-5">{trimmedLine.substring(5)}</h3>);
    } else if (trimmedLine.includes('prinsip belajar berkesadaran, bermakna, dan menggembirakan')) {
        elements.push(<p key={`p-${i}`} className="mb-3 text-blue-600 italic">{trimmedLine}</p>);
    } else if (trimmedLine !== '') {
        const renderedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
        elements.push(<p key={`p-${i}`} className="mb-3" dangerouslySetInnerHTML={{ __html: renderedLine }} />);
    }

    i++;
  }

  return elements;
};


const GeneratedPlan: React.FC<GeneratedPlanProps> = ({ planText }) => {
  return (
    <div className="prose prose-slate max-w-none text-base leading-relaxed">
      {parseAndRender(planText)}
    </div>
  );
};

export default GeneratedPlan;
