import { all } from "axios";

type baseType = string|number|boolean
export interface IObjAny { [propName: string|number]: any }
export interface IObjStrNo { [propName: string|number]: baseType|Array<baseType>|Array<IObjStrNo>|IObjStrNo }
export interface IOption {
    label: string;
    value: string|number;
}
export enum EFormMode {
    READ = 'form-read',
    EDIT = 'form-edit',
}


export interface IFormListItem {
    modelKey: string;
    modelType: string;
    label: string;
    
    labelWidth?: string;
    labelIcon?: Function;
    placeholder?: string;
    defaultVal?: string|number|Array<string|number>|Array<IObjStrNo>|IObjStrNo;
    ifShow?: boolean|Function;
    options?: Array<IOption>;
    txtTips?: Array<string>;
    orgCfg?: IObjStrNo;
    colSpan?: number;
    style?: IObjStrNo;
    allowClear?: boolean;
    fetchLoading?: boolean;
    change?: Function;
    search?: Function;
}

