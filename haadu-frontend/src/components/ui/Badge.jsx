export default function Badge({ children, style = {} }) {
  return (
    <span className="badge" style={style}>
      {children}
    </span>
  )
}