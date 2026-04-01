export default function Button({
  children,
  color = 'white',
  className = '',
  ...props
}) {
  return (
    <button className={`btn btn-${color} ${className}`} {...props}>
      {children}
    </button>
  )
}