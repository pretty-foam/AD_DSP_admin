<template>
  <!--动态搜索-->
  <el-select v-model="state" :multiple=multiple :disabled=disabled 	 filterable :placeholder=placeholder class="select" @focus="getOptionsList" >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :disabled="item.disabled"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    searchString: {
      type: Function,
      default: () => [
        {
          value: "1",
          label: "测试1"
        },
        {
          value: "2",
          label: "测试2"
        }
      ]
    },
    disabled:{
      type:Boolean,
      default:false
    },
    //是否多选
    multiple:{
      type:Boolean,
      default:false,
    },
    /**下拉框是否显示全部 */
    isAllString:{
      type:Boolean,
      default:true,
    },
  },
  data() {
    return {
      options:[],//选项
      state:"",//值
    };
  },
  methods: {
    //获取列表
    async getOptionsList() {
         this.options =await this.searchString()
         this.isAllString?null :this.options =this.options.slice(1)
    },
    init(){
      this.state = this.$attrs.value   //初始化值
    }
  },
  async mounted() {
    await this.getOptionsList()   
    this.init()
  },
  watch:{
    //变更父组件绑定值
    state(val){
        // console.log('子组件值变化:',val)
        this.$emit('update:value',val)
        let  label = this.options.filter(el=>el.value ==val)[0]||{}
        this.$emit('update:label',label.label)
    },
    //父组件绑定值变化，改变当前组件值
    '$attrs.value'(val){
      // console.log('父组件值变化：',val)
        this.getOptionsList()
        this.state = val 
    }
  }
};
</script>
<style lang="scss" scoped>
.select{
  min-width: 130px ;
}
</style>