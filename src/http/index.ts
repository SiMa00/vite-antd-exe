
import ATAxios from "../packages/index"
// import ATAxios from "auto-axios"

import type { IAutoRequestCfg } from "auto-axios"

import { AutoReqCfg } from "./httpCfg"

// const a:IAutoRequestCfg = {}

const ax = new ATAxios(AutoReqCfg)

export default ax