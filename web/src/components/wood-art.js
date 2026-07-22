import React from 'react'

// Procedural product artwork: every product renders as a stylized SVG "photo"
// built from its wood tones, so the site ships with zero binary assets.
// Replace with real photography by adding an `image` field to the product
// data and swapping this component where it is used.

let uid = 0

function Grain ({id, from, to}) {
  return (
    <defs>
      <linearGradient id={`${id}-bg`} x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stopColor={from} />
        <stop offset='100%' stopColor={to} />
      </linearGradient>
      <linearGradient id={`${id}-hl`} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stopColor='#ffffff' stopOpacity='0.28' />
        <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
      </linearGradient>
    </defs>
  )
}

function grainLines (w, h, color, count = 7) {
  const lines = []
  for (let i = 0; i < count; i++) {
    const y = (h / (count + 1)) * (i + 1)
    const wobble = 6 + ((i * 7) % 11)
    lines.push(
      <path
        key={i}
        d={`M0 ${y} C ${w * 0.25} ${y - wobble}, ${w * 0.5} ${y + wobble}, ${w} ${y - wobble / 2}`}
        stroke={color}
        strokeOpacity='0.22'
        strokeWidth='2'
        fill='none'
      />
    )
  }
  return lines
}

export default function WoodArt ({tone = ['#5d4433', '#8a6a4f'], art = 'sign', title}) {
  const id = `wa-${uid++}`
  const [from, to] = tone
  const w = 400
  const h = 300

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role='img' aria-label={title || 'Product artwork'} preserveAspectRatio='xMidYMid slice'>
      <Grain id={id} from={from} to={to} />
      <rect width={w} height={h} fill={`url(#${id}-bg)`} />
      {grainLines(w, h, '#1f1610')}
      <rect width={w} height={h * 0.45} fill={`url(#${id}-hl)`} />

      {art === 'sign' && (
        <g>
          <rect x='60' y='75' width='280' height='150' rx='12' fill='none' stroke='#f7efe2' strokeOpacity='0.85' strokeWidth='4' />
          <rect x='74' y='89' width='252' height='122' rx='8' fill='none' stroke='#f7efe2' strokeOpacity='0.4' strokeWidth='2' />
          <text x='200' y='145' textAnchor='middle' fontFamily='Georgia, serif' fontSize='34' fill='#f7efe2' fontWeight='bold'>LF</text>
          <line x1='110' y1='168' x2='290' y2='168' stroke='#f7efe2' strokeOpacity='0.8' strokeWidth='3' />
          <text x='200' y='192' textAnchor='middle' fontFamily='Georgia, serif' fontSize='14' fill='#f7efe2' fontOpacity='0.85' letterSpacing='4'>EST. 2016</text>
        </g>
      )}

      {art === 'topo' && (
        <g fill='none' stroke='#f7efe2' strokeWidth='2.5'>
          <path d='M40 240 C 110 200, 150 235, 210 195 S 330 205, 370 165' strokeOpacity='0.9' />
          <path d='M40 205 C 105 165, 160 200, 215 160 S 320 170, 370 130' strokeOpacity='0.7' />
          <path d='M55 170 C 115 135, 170 165, 220 128 S 315 138, 360 100' strokeOpacity='0.5' />
          <path d='M75 138 C 125 108, 180 132, 225 100 S 305 108, 345 78' strokeOpacity='0.35' />
          <circle cx='226' cy='128' r='5' fill='#f7efe2' stroke='none' fillOpacity='0.9' />
        </g>
      )}

      {art === 'board' && (
        <g>
          <rect x='70' y='60' width='260' height='180' rx='18' fill='#00000022' />
          <rect x='62' y='52' width='260' height='180' rx='18' fill={to} stroke='#f7efe2' strokeOpacity='0.55' strokeWidth='3' />
          <rect x='80' y='70' width='224' height='144' rx='10' fill='none' stroke='#f7efe2' strokeOpacity='0.4' strokeWidth='2.5' />
          <circle cx='300' cy='74' r='7' fill='#1f161066' />
          {grainLines(224, 144, '#1f1610', 4).map((line, i) => (
            <g key={i} transform='translate(80 70)'>{line}</g>
          ))}
        </g>
      )}

      {art === 'clock' && (
        <g>
          <circle cx='200' cy='150' r='95' fill={to} stroke='#f7efe2' strokeOpacity='0.7' strokeWidth='4' />
          <circle cx='200' cy='150' r='80' fill='none' stroke='#1f1610' strokeOpacity='0.25' strokeWidth='1.5' />
          {[...Array(12)].map((_, i) => {
            const a = (i * Math.PI) / 6
            return (
              <line
                key={i}
                x1={200 + Math.sin(a) * 70}
                y1={150 - Math.cos(a) * 70}
                x2={200 + Math.sin(a) * 80}
                y2={150 - Math.cos(a) * 80}
                stroke='#f7efe2'
                strokeOpacity='0.8'
                strokeWidth={i % 3 === 0 ? 4 : 2}
              />
            )
          })}
          <line x1='200' y1='150' x2='200' y2='95' stroke='#f7efe2' strokeWidth='5' strokeLinecap='round' />
          <line x1='200' y1='150' x2='240' y2='170' stroke='#f7efe2' strokeWidth='4' strokeLinecap='round' />
          <circle cx='200' cy='150' r='6' fill='#e0a04e' />
        </g>
      )}

      {art === 'furniture' && (
        <g stroke='#f7efe2' strokeWidth='4' strokeOpacity='0.85' fill='none'>
          <rect x='70' y='95' width='260' height='95' rx='8' fill='#00000026' />
          <line x1='200' y1='100' x2='200' y2='185' strokeWidth='2.5' strokeOpacity='0.5' />
          <line x1='85' y1='142' x2='195' y2='142' strokeWidth='2.5' strokeOpacity='0.5' />
          <line x1='95' y1='190' x2='80' y2='240' />
          <line x1='305' y1='190' x2='320' y2='240' />
          <line x1='130' y1='190' x2='120' y2='240' strokeOpacity='0.5' strokeWidth='2.5' />
          <line x1='270' y1='190' x2='280' y2='240' strokeOpacity='0.5' strokeWidth='2.5' />
          <circle cx='140' cy='120' r='4' fill='#f7efe2' stroke='none' />
        </g>
      )}

      {art === 'slats' && (
        <g>
          {[...Array(9)].map((_, i) => (
            <rect
              key={i}
              x={48 + i * 36}
              y='45'
              width='18'
              height='210'
              rx='4'
              fill={i % 2 ? to : from}
              stroke='#1f1610'
              strokeOpacity='0.35'
            />
          ))}
        </g>
      )}
    </svg>
  )
}
