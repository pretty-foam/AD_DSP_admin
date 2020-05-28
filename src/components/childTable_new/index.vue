<template>
    <!--查询作弊（徒弟列表展示）-->
    <div class="on">
        <!--表格-->
        <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            >
            <el-table-column
                v-for="(val,index) of tableDataTitle" 
                :key = index
                :show-overflow-tooltip="val.tips"
                :label=val.label
                :min-width=val.width
                align="center"
            >
            <template slot-scope="{row}">
                        {{row[val.value]|filterTable(statusOptions,val.value,typeOptions)}} 
            </template>
            </el-table-column>
        </el-table>
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {userPupil,userPupil_invite}  from '@/api/common'
import { parseTime }  from '@/utils/index'
export default {
    components:{
        Pagination
    },
    props:{
        userId:'',//用户ID
        inviteCode:'',//邀请码
    },
    data(){
        return{
            tableDataTitle:[
                {
                    label:"昵称",
                    value:'nickName',
                },
                {
                label:"电话",
                value:"tel",
                },
                {
                    label:"登录时间",
                    value:'time',
                },
                {
                    label:"IP",
                    value:"ip"
                } ,
                 {
                    label:"龙等级",
                    value:"level"
                } ,
            ],//表格标题
            total:0,//总计
            tableData:[{}],//表格数据
            listQuery:{
                limit:10,
                page:1,
            },
            listLoading:false,// 加载中
            statusOptions:[
                {
                    label:'禁封',
                    value:0,
                },
                {
                    label:'可用',
                    value:1
                }
            ],//状态选择
            typeOptions:[
            
                 {
                    label:3,
                    value:"徒弟"
                },
                 {
                    label:4,
                    value:"徒孙"
                },
            ],
            dialogFormVisible:false,//审核弹窗
            temp:{
            },//审核弹窗数据
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },//默认快捷日期
        }
    },
    methods:{
            init(){
                this.listQuery.page =1
                this.getList(this.listQuery)
            },
            /** 获取用户列表信息 */
            async getList(page) {
                this.listLoading = true
                let data = null 
                //id invitecode 查询
                if(this.userId){
                  let  res = await userPupil({
                        pageNum:page.page,
                        pageSize:page.limit,
                        uid:this.userId
                  })
                  data =res.data
                }else {
                    let  res = await userPupil_invite({
                        pageNum:page.page,
                        pageSize:page.limit,
                        inviteCode:this.inviteCode
                    })
                  data =res.data
                }
                this.tableData = data.result.list
                this.total = data.result.total
                this.listLoading = false
            },
    },
    created(){
        this.init()
    },
    filters:{
        filterTable(val,options,index,typeOptions){
            if(index =='status'&&val!==undefined){
               return options.filter(el=>val==el.value)[0].label
            }else if(index=='loginTime'){
                return val?parseTime(val):'---'
            }else if(index=='getType'&&val!==undefined){
               return typeOptions.filter(el=>val==el.label)[0].value
            }else if(index=='isEffect' &&val!==undefined){
               return options.filter(el=>val==el.value)[0].label
            }
            return val 
        }
    },
    watch:{
        userId(){
            this.init()
        },
        inviteCode(){
            this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
.check_btn{
    display: flex;
    justify-content: center;
}
</style>