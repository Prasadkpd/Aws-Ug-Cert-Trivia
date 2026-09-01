import Icon from './Icon';

/**
 * Shown after EVERY answer, right or wrong — the booth's actual purpose is
 * teaching, so this is styled as a distinct informational surface rather than
 * as success or failure feedback.
 */
export default function ExplanationCard({ text }) {
  return (
    <div className="explain">
      <span className="explain__icon">
        <Icon name="explanation" size={24} fill />
      </span>
      <div className="explain__body">
        <p className="explain__title">Why</p>
        <p className="explain__text">{text}</p>
      </div>
    </div>
  );
}
