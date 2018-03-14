'use babel'

import { convert, parse } from 'units-css'
import { SUPPORTED_UNITS } from '../config'

export const toPx = (val) => {
  const check = parse(val)
  // throw or reject?
  console.log(check)
  val = convert('px', val)
  console.log('val', val);
  return val
}
