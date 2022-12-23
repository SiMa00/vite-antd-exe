
export type TBase = string|number|boolean
export type TBaseNull = TBase|undefined|null

// 不带 {} 的类型
export type TBaseValNull = TBaseNull|Array<TBaseNull>
export interface IBaseObj { [propName: string]: TBase|Array<TBase> }
export interface IBaseObjNull { [propName: string]: TBaseNull|Array<TBaseNull> }

// 带 {} 的类型
export interface IObjAny { [propName: string]: any }
export interface IObj { [propName: string]: TBaseNull|Function|Array<TBaseNull>|Array<IObj>|IObj }

export interface IOption {
    label: string;
    value: string;
}
// 列表查询条件 模式; 此模式 margin-bottom变小，rule 属性无效，其他与 edit模式无差别;
export enum EFormMode {
    READ = 'form-read',
    LIST = 'form-list',
    EDIT = 'form-edit',
}
export interface IBaseRule {
    enum?: any[];
    len?: number;
    max?: number;
    message?: string;
    min?: number;
    pattern?: RegExp;
    required?: boolean;
    transform?: (value: any) => any;
    trigger?: 'blur' | 'change' | Array<'change' | 'blur'>;
    validator?: (rule: IBaseRule, value: any, callback: (error?: string) => void) => Promise<void>|void;
    whitespace?: boolean;
}

export interface IFormButton {
    key: string;
    label: string;
    clickEvt: (() => void);
    
    icon?: Function;
    orgCfg?: IObjAny;
    ifShow?: boolean|Array<string>|((act:string, row:IObjAny) => boolean);
}
export interface IFormListItem {
    modelKey: string;
    modelType: string;
    label: string;
    
    labelWidth?: string;
    labelIcon?: Function;
    placeholder?: string|Array<string>;
    defaultVal?: TBase|Array<TBase>;
    ifShow?: boolean|((fModel:IBaseObjNull) => boolean); // 回调 formModel
    options?: Array<IOption>;
    txtTips?: Array<string>;
    orgCfg?: IObjAny;
    colSpan?: number;
    style?: IObjAny;
    allowClear?: boolean;

    addonSBefore?: 'on'|'off';
    addonSBCfg?: IBaseObj;
    beforeModelKey?: string;
    defaultSBVal?: string;
    beforeOptions?: Array<IOption>;
    bReadVal?: string, // 只读时 展示的值，会自动生成，不要主动加进 modellist

    addonSAfter?: 'on'|'off';
    addonSACfg?: IBaseObj;
    afterModelKey?: string;
    defaultSAVal?: string;
    afterOptions?: Array<IOption>;
    aReadVal?: string, // 只读时 展示的值，会自动生成，不要主动加进 modellist

    fetchLoading?: boolean;
    change?: Function;
    search?: Function;
}

