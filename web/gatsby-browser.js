import React from 'react'
import {CartProvider} from './src/context/cart-context'
import './src/styles/global.css'

export const wrapRootElement = ({element}) => <CartProvider>{element}</CartProvider>
