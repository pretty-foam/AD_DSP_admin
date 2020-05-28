<template>
     <!--提现列表-->   
    <div class="outCash" >
        <div class="filter-container">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-date-picker
                        v-model="form.time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format='timestamp'
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        size="small"
                        >
                    </el-date-picker>
                </el-col>
                <el-col :span="5" >
                    <el-input  v-model="form.money" placeholder="提现金额(元)" size="small" ></el-input>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="form.status" placeholder="请选择提现状态" size="small" >
                        <el-option
                        v-for="item in cashStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="small" icon="el-icon-search" @click="init">
                        查询
                    </el-button>
                </el-col>
            </el-row >
        </div>
        <!--表格-->
        <el-table
            v-loading="listLoading"
            :data="tableList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            >
            <el-table-column
            v-for="(val,index) of tableTitle" 
            :key = index
            :show-overflow-tooltip="val.tips"
            :label=val.label
            :min-width=val.width
            align="center"
            >
            <template slot-scope="{row}">
                        {{row[val.value]|statusFilter(val.options,val.value)}} 
            </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleChild(row)">
                        查询作弊
                </el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <pagination style="padding: 10px 16px;" v-if="total>listQuery.limit" :pageSizes=[10] :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
            <!--徒弟列表弹窗-->
        <el-dialog
            title="徒弟列表"
            :visible.sync="dialogChild"
            width='800px !important'
            class="dialogChild"
            >
            <childTable :userId=userId />
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {parseTime}  from '@/utils/index'
import childTable from '@/components/childTable_new'
import {cashList,withDrawTypeList} from '@/api/finance' 

export default {
    props:{
        inviteCode:'',//邀请码  
        uid:'',// user id 
    },
    components:{
        Pagination,childTable
    },
    data(){
        return{
            form:{
                inviteCode:null,//邀请码
                status:'',//状态
                time:[new Date().getTime(),new Date().getTime()],//时间
                money:null,
            },
            cashStatus:[
                {
                    label:'全部',
                    value:null,
                },
                {
                    label:"成功",
                    value:1,
                },
                {
                    label:"失败",
                    value:2
                },
                 {
                    label:"审核",
                    value:3
                },
                 {
                    label:"拒绝",
                    value:4
                },
                 {
                    label:"打款中",
                    value:5
                }
            ],//提现状态选择
            userStatus:[
                {
                    label:"可用",
                    value:1
                },
                {
                    label:"禁封",
                    value:0
                }
            ],//用户状态
            tableList:[], //表格列表
            tableTitle:[
                {
                    label:"ID",
                    value:"uid"
                },
                {
                    label:'邀请码',
                    value:'inviteCode'
                },
               
                {
                    label:'提现金额',
                    value:'money',
                },
                {
                    label:"提现状态",
                    value:"withdrawStatus",
                },
                {
                    label:"提现时间",
                    value:"withdrawTime",
                },
                 {
                    label:"支付单号",
                    value:"paymentNo",
                },
                {
                    label:"到账时间",
                    value:"paymentTime",
                },
                 {
                    label:"用户状态",
                    value:"userStatus",
                },
                {
                    label:'错误描述',
                    value:'errCodeDes',
                },
            ],//表格标题
            listQuery:{
                limit:10,
                page:1,
            },//分页信息
            total:0,//总计
            listLoading:false,//表格loading
            dialogChild:false,//徒弟弹窗控制
            userId:'',//当前行id
        }
    },
    methods:{
        //初始化
        async init(){
            this.form.inviteCode = this.inviteCode
            this.form.uid = this.uid
            await this.getList({limit:10,page:1})
            this.listQuery.page = 1
        },
        /**列表数据 */
        async getList(page){
            this.listLoading = true 
            for(let i in this.form){
                this.form[i] = this.form[i]||null 
            }
            this.form.time = [new Date().getTime()-1000*3600*24*180,new Date().getTime()]
            const { data } = await cashList({
                pageNum:page.page,
                pageSize:page.limit,
                begin:this.form.time[0],
                end:this.form.time[1],
                ...this.form,
                money:this.form.money*100||null
            })
            this.tableTitle.forEach(el=>{
                if(el.label=='用户状态'){
                    el.options = this.userStatus
                }else if(el.label =='提现状态'){
                    el.options = this.cashStatus
                }
            })
            data.result.forEach(el=>{
                el.money = el.money/100
            })
            this.total = data.count
            this.tableList = data.result
            this.listLoading = false
        },
        /**处理 */
        handleChild(row){
            this.userId = row.uid
            this.dialogChild =true
        },
        /**初始化提现状态 */
        async  initType(){
            let { data } = await withDrawTypeList()
            let cashStatus = this.cashStatus = [{label:"全部",value:null}]
            data = data.result ||{}
            Object.keys(data).forEach(key=>{
                cashStatus.push({
                    label:data[key],
                    value:key
                })
            })
        }
    },
    filters:{
        //过滤
        statusFilter(val,options,index){
           if(index=='userStatus' && val !=undefined ){
               val = options.filter(el=>el.value==val)[0]||{label:val}
               return val.label
           }else if(index=='withdrawTime' &&val!=undefined){
               val = parseTime(val)
           }else if(index == 'withdrawStatus' && val !=undefined){
               let  value = val 
               val = options.filter(el=>el.value==val)[0]||{label:"未知状态"}
               return val.label+`(${value})`
           }
            return val
        }
    },
    async created(){
        await this.initType()
        await this.init()
    },
    watch:{
        inviteCode(val){
            this.form.money = null 
            this.init()
        },
        uid(val){
            this.form.money = null 
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
 .outCash{
     background: white;
 }
</style>