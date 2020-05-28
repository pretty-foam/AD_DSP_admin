<template>
    <!--表单内嵌弹窗-->
    <el-popover
        v-if="val.label!=='状态'"
        v-model="show"
        placement="top-start"
        :title=val.label
        trigger="click"
        width="300"
        @show="showPopover"
        > 
        <span class="table_detail">
            <el-input autosize 	 type="textarea" :rows="2" :show-word-limit=true :maxlength=maxLength v-if="!val.options" v-model="inputVal" size="small" class="table_detail_input"/>
            <el-select v-else v-model="selectVal" size="small"  class="table_detail_input" >
                <el-option
                    v-for="item in val.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-row style="margin-top:10px">
                <el-button type="primary" icon="el-icon-check" size="mini" @click="confirm"></el-button>
                <el-button  icon="el-icon-close" size="mini" @click="show=false"></el-button>
            </el-row>
        </span>
        <span slot="reference" class="table_content">
            <slot name="content">
            </slot>
        </span>
    </el-popover>
</template>
<script>
export default {
    props:{
        row:{
            default:{},
            type:Object,
        }, //行
        val:{
            default:{},
            type:Object
        }, //tableTitle属性
        submit:{
            default:()=>{},
            type:Function
        },//提交函数
        maxLength:{
            type:Number,
        },//最大字符长度
    },
    data(){
        return{
            show:false,//是否展示
            inputVal:null ,//输入值
            selectVal:null,//选择值
        }
    },
    methods:{
        /**提交 */
        async confirm(){
            this.row[this.val['value']] = this.val.options? this.selectVal:this.inputVal 
            await this.submit(this.row)
            this.show =false
        },
        /**显示时初始化 */
        showPopover(){
            this.inputVal = this.row[this.val['value']] 
            this.selectVal = this.row[this.val['value']] 
        }
    },
}
</script>

