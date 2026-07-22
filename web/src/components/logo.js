import React from 'react'

export default function Logo ({className = 'brand-mark'}) {
  return (
    <svg className={className} viewBox='0 0 48 48' role='img' aria-label='Luminary Fusion Studios logo'>
      <defs>
        <linearGradient id='logo-grad' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#e0a04e' />
          <stop offset='100%' stopColor='#c8873a' />
        </linearGradient>
      </defs>
      <rect x='2' y='2' width='44' height='44' rx='10' fill='#2b2118' />
      {/* CNC bit cutting a spiral of "light" out of the timber */}
      <path
        d='M24 10 a14 14 0 1 0 14 14'
        fill='none'
        stroke='url(#logo-grad)'
        strokeWidth='3.5'
        strokeLinecap='round'
      />
      <path
        d='M24 17 a7 7 0 1 0 7 7'
        fill='none'
        stroke='url(#logo-grad)'
        strokeWidth='3'
        strokeLinecap='round'
        strokeOpacity='0.7'
      />
      <circle cx='24' cy='24' r='2.6' fill='#faf6ef' />
    </svg>
  )
}
