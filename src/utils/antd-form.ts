

import {
    Affix,
    Anchor,
    AutoComplete,
    Alert,
    Avatar,
    BackTop,
    Badge,
    Breadcrumb,
    Button,
    Calendar,
    Card,
    Collapse,
    Carousel,
    Cascader,
    Checkbox,
    Col,
    Comment,
    ConfigProvider,
    DatePicker,
    Descriptions,
    Divider,
    Dropdown,
    Drawer,
    Empty,
    Form,
    Grid,
    Input,
    Image,
    InputNumber,
    Layout,
    List,
    message,
    Menu,
    Mentions,
    Modal,
    Statistic,
    notification,
    PageHeader,
    Pagination,
    Popconfirm,
    Popover,
    Progress,
    Radio,
    Rate,
    Result,
    Row,
    Select,
    Skeleton,
    Slider,
    Space,
    Spin,
    Steps,
    Switch,
    Table,
    Transfer,
    Tree,
    TreeSelect,
    Tabs,
    Tag,
    TimePicker,
    Timeline,
    Tooltip,
    Typography,
    Upload,
    LocaleProvider,
} from 'ant-design-vue'
import { isEmpty, isNotEmpty } from "@/utils/tool"

const components = [
    AutoComplete,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Row,
    Select,
    Steps,
    Switch,
    Tree,
    TreeSelect,
    TimePicker,
    Timeline,
    Skeleton,
]

// export default {
//     install (app:any) {
//         Object.keys(components).forEach(function (key:any) {
//             const cmp = components[key]
//             console.log(111, cmp)
            
//             if (cmp.install) {
//                 app.use(cmp)
//             }
//         })
//     },
// }

export default function installAntd(app:any):void{
    components.forEach(item => {
        // console.log(item)
        // app.component(item.name, item)
        app.use(item)
    })
    // app.use(Button)
    // app.use(Form)
    // app.use(Input)
    // app.config.globalProperties.$message = message;
}