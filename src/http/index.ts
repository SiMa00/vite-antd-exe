
import ATAxios from "../packages/index"
// import ATAxios from "auto-axios"
// console.log('11 >', ATAxios)

import type { IAutoRequestCfg } from "auto-axios"

import { AutoReqCfg } from "./httpCfg"

// const a:IAutoRequestCfg = {}

const ax = new ATAxios(AutoReqCfg)

export default ax