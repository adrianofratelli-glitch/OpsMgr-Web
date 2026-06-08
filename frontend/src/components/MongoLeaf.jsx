// Logo oficial (folha) da MongoDB em SVG
export default function MongoLeaf({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-label="MongoDB">
      <path
        d="M12 1.5c1.85 3.8 4.95 5.9 4.95 10.6 0 4.05-2.25 6.65-4.2 8.05l-.35 2.35h-.8l-.35-2.35c-1.95-1.4-4.2-4-4.2-8.05C6.85 7.4 9.95 5.3 12 1.5z"
        fill="#00ED64"
      />
      <path
        d="M12 1.5c1.85 3.8 4.95 5.9 4.95 10.6 0 4.05-2.25 6.65-4.2 8.05L12 22V1.5z"
        fill="#00684A"
        opacity="0.9"
      />
    </svg>
  )
}
