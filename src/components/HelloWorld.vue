<template>
  <div style="position: relative">
    <div id="canvas" class="container">
      <div class="title-container">
        <div class="title-wrap">{{ pageConfig.id }}号楼</div>
        <el-input
          v-model="pageConfig.title"
          style="width: 300px"
          placeholder="请输入标题"
          class="title-wrap"
        ></el-input>
      </div>

      <div class="select-house">
        <div>
          <span> 楼栋： </span>
          <el-select
            v-model="pageConfig.id"
            placeholder="请选择"
            allow-create
            filterable
            @change="selectHouseFromCache()"
            style="width: 100px"
          >
            <el-option
              v-for="item in houstOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div style="padding-bottom: 8px">更新时间：{{ dateStr }}</div>
      </div>

      <div class="hello">
        <div
          class="house-item"
          v-for="(house, houseIndex) in houseList"
          :key="houseIndex"
        >
          <div class="house-item-left">
            <el-popover
              placement="right"
              width="200"
              height="400"
              trigger="click"
            >
              <div>
                <div class="select-item">
                  <span> 家庭人数: </span>
                  <el-select
                    v-model="house.members"
                    placeholder="请选择"
                    allow-create
                    filterable
                    style="width: 120px"
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
                  <span> 居住类型: </span>
                  <el-select
                    v-model="house.type"
                    placeholder="请选择"
                    style="width: 120px"
                  >
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
                style="height: 100%"
                class="link house-info"
                slot="reference"
              >
                <div>{{ house.name }}{{ house.members }}人</div>
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
                      allow-create
                      filterable
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
                      allow-create
                      filterable
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
          <div class="empty-view" v-else-if="house.type === 'exclude'">
            <span contenteditable="true">
              {{ house.note || "不参与统计" }}
            </span>
          </div>
          <div
            class="empty-view"
            v-else-if="house.members === 0 && house.type !== 'no'"
          >
            <span contenteditable="true">
              {{ "无住户" }}
            </span>
          </div>
          <div class="empty-view" v-else-if="house.type === 'no'">
            <span contenteditable="true">
              {{ "无住户" }}
            </span>
          </div>
        </div>
      </div>

      <h6 contenteditable="true">
        备注:点击房间:设置房间信息，点击待测区域:进行结果统计
      </h6>
    </div>

    <el-button round class="mark-btn select-item" @click="saveData()"
      >保存数据</el-button
    >
    <el-button round class="mark-btn select-item" @click="reset()"
      >重置数据</el-button
    >
    <el-button round class="mark-btn select-item" @click="exportPic()"
      >导出图片</el-button
    >
    <el-button round @click="dialogFormVisible = true">新增房间</el-button>
    <el-button round @click="delHouse()">删除房间</el-button>
    <div>
      <h5>
        声明：本程序只为有需要的邻友提供统计便利，不做任何数据存储分析，使用人行为与本程序无关
      </h5>
    </div>

    <el-dialog
      title="新建住户信息填写"
      width="300"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="住户名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="住户人数">
          <el-input v-model="formData.members"></el-input>
        </el-form-item>
        <el-form-item label="住户类型">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              v-for="item in peopleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { HOUSE_LIST, peopleTypeOptions, getCount } from "./const";
import html2canvas from "html2canvas";

const titleStr = "抗原自测邻友汇总";
const HOUSE_OPTIONS = new Array(100).fill(1).map((item, index) => {
  let val = index + 1;
  return {
    label: val,
    value: val,
  };
});

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      houstOptions: HOUSE_OPTIONS,
      formData: {
        name: "xxx室",
        type: "no",
        members: 0,
      },
      dialogFormVisible: false,
      pageConfig: {
        title: titleStr,
        id: 26,
      },
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
        {
          label: 5,
          value: 5,
        },
        {
          label: 6,
          value: 6,
        },
        {
          label: 7,
          value: 7,
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
    this.selectHouseFromCache();
  },

  methods: {
    onSubmit() {
      let data = JSON.parse(JSON.stringify(this.formData));
      data.count = getCount();
      this.houseList.push(data);
      this.dialogFormVisible = false;
    },
    delHouse() {
      this.houseList.pop();
    },
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
      this.pageConfig.title = titleStr;
      this.saveData();
    },
    saveData() {
      let houseId = this.pageConfig.id;
      let houseStore = JSON.parse(localStorage.getItem("houseStore")) || {};
      let newHouseStore = {
        ...houseStore,
        [houseId]: {
          pageConfig: this.pageConfig,
          houseList: this.houseList,
        },
      };
      localStorage.setItem("houseStore", JSON.stringify(newHouseStore));
    },

    selectHouseFromCache() {
      let houseId = this.pageConfig.id;
      let houseStore = JSON.parse(localStorage.getItem("houseStore")) || {};
      let houseConfig = houseStore[houseId];

      if (!houseConfig) {
        this.reset();
        return;
      }
      const { pageConfig = {}, houseList = [] } = houseConfig;

      this.pageConfig = pageConfig;
      this.houseList = houseList;
    },
    getStateText(results = {}) {
      let { yin, yang } = results || {};

      if (yang && yin) {
        return `${yin}人阴，${yang}人阳`;
      }

      if (yang) {
        return `${yang}人阳`;
      }

      if (yin) {
        return `${yin}人阴`;
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
  flex-shrink: 0;
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
  height: 100px;
  line-height: 100px;
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

.add-house {
  width: 100%;
  height: 100%;
  text-align: center;
  border-right: 1px solid #331a00;
  border-bottom: 1px solid #331a00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.house-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-house {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  justify-content: space-around;
  min-width: 700px;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-wrap {
  display: inline-block;
  border: none !important;
  font-size: 24px;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
}
.title-wrap /deep/.el-input__inner {
  border: none !important;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
}
</style>
