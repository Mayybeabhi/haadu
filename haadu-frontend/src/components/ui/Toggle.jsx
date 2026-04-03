export default function Toggle({ checked, onChange, label }) {
  return (
    <div className="toggle-wrap">
      {label && <span className="helper-text">{label}</span>}
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}