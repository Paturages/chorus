import './style.scss';

export default ({ label, className, ...props }) => (
  <div className="Skeleton" style={props.style} />
);
