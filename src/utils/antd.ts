
import 'ant-design-vue/dist/antd.css' // tem TODO 单个导入
// import { isEmpty, isNotEmpty } from "@/utils/tool" 
import {
    AutoComplete,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    FormItem,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Skeleton,
    Switch,
    Table,
    Tree,
    TreeSelect,
    Tag,
    TimePicker,
    Timeline,
} from 'ant-design-vue'

const components = [
    AutoComplete,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    FormItem,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Switch,
    Table,
    Tree,
    TreeSelect,
    Tag,
    TimePicker,
    Timeline,
    Skeleton,
]

export default function installAntd(app:any):void{
    components.forEach(item => {
        app.use(item)
    })
    // app.config.globalProperties.$message = message;
}