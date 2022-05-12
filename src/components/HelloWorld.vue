<template>
  <div>
    <div id="canvas" class="container">
      <div>
        <h3>358弄26号楼抗原情况汇总</h3>
        <div style="padding-bottom: 8px">更新时间：{{ dateStr }}</div>
      </div>

      <div class="hello">
        <div
          class="house-item"
          v-for="(house, houseIndex) in houseList"
          :key="houseIndex"
        >
          <div class="house-item-left">
            <el-popover placement="right" width="284" trigger="click">
              <div>
                <div class="select-item">
                  <span class="test-ying-text"> 家庭人数: </span>
                  <el-select v-model="house.members" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="select-item">
                  <span class="test-yang-text"> 居住类型: </span>
                  <el-select v-model="house.type" placeholder="请选择">
                    <el-option
                      v-for="item in peopleTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div
                style="height: 100%; line-height: 100px"
                class="link"
                slot="reference"
              >
                {{ house.name }}{{ house.members }}人
              </div>
            </el-popover>
          </div>
          <div class="house-item-right" v-if="house.type === 'zh'">
            <div
              class="cout-item"
              :class="getClass(countItem.results)"
              v-for="(countItem, resultIndex) in house.count"
              :key="resultIndex"
            >
              <el-popover placement="right" width="300" trigger="click">
                <div>
                  <el-button
                    round
                    class="mark-btn select-item"
                    @click="markYin(countItem, house.members)"
                    >标记全阴</el-button
                  >
                  <el-button
                    round
                    class="mark-btn select-item"
                    @click="resetYin(countItem)"
                    >重置标记</el-button
                  >
                  <div class="select-item">
                    <span class="test-ying-text"> 阴性: </span>
                    <el-select
                      v-model="countItem.results.yin"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="select-item">
                    <span class="test-yang-text"> 阳性: </span>
                    <el-select
                      v-model="countItem.results.yang"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="link" slot="reference">
                  {{ getStateText(countItem.results) }}
                </div>
              </el-popover>
            </div>
          </div>
          <div class="empty-view" v-else-if="house.type === 'jw'">
            {{ house.note || "居委" }}
          </div>
          <div class="empty-view" v-else-if="house.type === 'no'">
            {{ house.note || "无人" }}
          </div>
        </div>
      </div>

      <h3>备注:灰色无人，仅对在楼栋居家人员进行核酸、抗原记录</h3>
    </div>
    <span>点击房间设置房间信息，点击待测区域进行结果统计</span>
    <el-button round class="mark-btn select-item" @click="reset()"
      >重新设置数据</el-button
    >
    <el-button round class="mark-btn select-item" @click="exportPic()"
      >导出图片</el-button
    >
  </div>
</template>

<script>
// import { STAT } from "./const.js";
// const CASE_STAT = {
//   [STAT.wait_test]: "待测",
//   [STAT.yin]: "阴性",
//   [STAT.yang]: "阳性",
// };
import { HOUSE_LIST, peopleTypeOptions } from "./const";
import html2canvas from "html2canvas";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      houseList: JSON.parse(JSON.stringify(HOUSE_LIST)),
      selectValue: "",
      options: [
        {
          label: 0,
          value: 0,
        },
        {
          label: 1,
          value: 1,
        },
        {
          label: 2,
          value: 2,
        },
        {
          label: 3,
          value: 3,
        },
        {
          label: 4,
          value: 4,
        },
      ],
      peopleTypeOptions,
      dateStr: new Date().toLocaleString(),
    };
  },

  watch: {
    houseList: {
      deep: true,
      handler() {
        this.saveData();
      },
    },
  },
  mounted() {
    this.initData();
  },

  methods: {
    exportPic() {
      /*图片跨域及截图模糊处理*/
      let canvasContent = document.getElementById("canvas"), //需要截图的包裹的（原生的）DOM 对象
        width = canvasContent.clientWidth, //canvasContent.offsetWidth || document.body.clientWidth; //获取dom 宽度
        height = canvasContent.clientHeight, //canvasContent.offsetHeight; //获取dom 高度
        canvas = document.createElement("canvas"), //创建一个canvas节点
        scale = 1; //定义任意放大倍数 支持小数
      canvas.width = width * scale; //定义canvas 宽度 * 缩放
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.style.width = canvasContent.clientWidth * scale + "px";
      canvas.style.height = canvasContent.clientHeight * scale + "px";
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      let opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true, // 【重要】开启跨域配置
      };

      html2canvas(canvasContent, opts).then(function (canvas) {
        let imgUrl = canvas.toDataURL("image/png");
        // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
        if (window.navigator.msSaveOrOpenBlob) {
          let bstr = atob(imgUrl.split(",")[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let blob = new Blob([u8arr]);
          window.navigator.msSaveOrOpenBlob(
            blob,
            "chart-download" + "." + "png"
          );
        } else {
          // 这里就按照chrome等新版浏览器来处理
          let a = document.createElement("a");
          a.href = imgUrl;
          a.setAttribute("download", "chart-download");
          a.click();
        }
      });
    },
    reset() {
      localStorage.setItem("houseList", JSON.stringify([]));
      this.houseList = JSON.parse(JSON.stringify(HOUSE_LIST));
    },
    initData() {
      let houseList = JSON.parse(localStorage.getItem("houseList"));
      if (houseList && houseList.length) {
        this.houseList = houseList;
      }
    },
    saveData() {
      localStorage.setItem("houseList", JSON.stringify(this.houseList));
    },
    getStateText(results = {}) {
      let { yin, yang } = results || {};

      if (yang && yin) {
        return `阴${yin}人，阳${yang}人`;
      }

      if (yang) {
        return `阳${yang}人`;
      }

      if (yin) {
        return `阴${yin}人`;
      }

      return "待测";
    },

    getClass(results = []) {
      let { yin, yang } = results || {};

      if (yang) {
        return "test-yang";
      }
      return yin > 0 ? "test-ying" : "test-wait";
    },

    markYin(res, defaultYin) {
      let { results } = res;
      this.$set(results, "yin", defaultYin);
      this.$set(results, "yang", 0);
    },
    resetYin(res) {
      let { results } = res;
      this.$set(results, "yin", 0);
      this.$set(results, "yang", 0);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.house-item {
  /* border: 1px solid #3d3d3d; */
  width: 200px;
  display: flex;
  align-items: stretch;
}

.house-item-left {
  border-right: 1px solid #3d3d3d;
  border-bottom: 1px solid #3d3d3d;
  width: 80px;
}
.house-item-right {
  display: flex;
  width: 120px;
  flex-direction: column;
  border-right: 1px solid #3d3d3d;
}

.cout-item {
  flex: 1;
  width: 100%;
  vertical-align: center;
  border-bottom: 1px solid #331a00;
}

.test-ying {
  background-color: #00cc33;
  color: #331a00;
}
.test-yang {
  background-color: #cc3333;
  color: white;
}
.test-ying-text {
  color: #00cc33;
}
.test-yang-text {
  color: #cc3333;
}
.test-wait {
  color: #e9e7ef;
}
.select-item {
  margin-top: 4px;
}

.link:hover {
  cursor: pointer;
  color: #7a95ff;
}

.link {
  height: 100%;
  line-height: 32px;
}

.mark-btn {
  margin-left: 34px;
}

.empty-view {
  width: 121px;
  padding-top: 20%;
  background-color: #eeeeee;
  color: #331a00;
  border-right: 1px solid #3d3d3d;
  border-bottom: 1px solid #3d3d3d;
}

.hello {
  margin: auto;
  display: flex;
  width: 801px;
  flex-wrap: wrap;
  border-left: 1px solid #3d3d3d;
  border-top: 1px solid #3d3d3d;
}

.container {
  padding: 4px 0;
}
</style>
