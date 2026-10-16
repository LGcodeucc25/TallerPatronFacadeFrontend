import { examLabel, formatDate } from '../constants';

export default function LabResultBadge({ result }) {
  const statusClass = result.withinRange ? 'badge normal' : 'badge out-of-range';

  return (
    <div className="lab-result">
      <div>
        <strong>{examLabel(result.examType)}</strong> · {result.parameter}
        <div className="muted small">{formatDate(result.date)}</div>
      </div>
      <div className="lab-values">
        <span>
          {result.value} {result.unit}
        </span>
        <span className="muted small">
          Rango: {result.minReference} – {result.maxReference} {result.unit}
        </span>
      </div>
      <span className={statusClass}>{result.withinRange ? 'Normal' : 'Fuera de rango'}</span>
    </div>
  );
}
