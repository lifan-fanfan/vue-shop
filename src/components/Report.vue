<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div ref="myPic" class="mypic"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
// import _ from 'lodash'
export default {
  mounted() {
    this.paintPic()
  },
  data() {
    return {
      data: {}
    }
  },
  methods: {
    async paintPic() {
      // 生命周期，已经加载完Dom元素
      var myChart = echarts.init(this.$refs.myPic)
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res.data)
      var option = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: res.data.legend.data
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: res.data.xAxis[0].data
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: res.data.series
      }

      // myChart.setOption(_.merge(res.data,option))
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.mypic {
  width: 700px;
  height: 400px;
}
</style>
