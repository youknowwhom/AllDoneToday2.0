<template>
    <div style="display: block">
      <el-card style="margin-bottom: 15px">
        <template #header>
          <div class="card-header">
            <span style="font-size: x-large">筛选条件</span>
            <el-button type="primary" @click="doQuery()"> 筛选</el-button>
          </div>
        </template>
        <div style="display:flex">
          <div>第</div>
          <div style="margin-left: 5px;margin-right: 5px;">
            <el-select v-model="weekQuery" style="width: 70px" size="small">
              <el-option
                  v-for="item in weekNum"
                  :value="item"
                  :key="item"
                  :label="item"
                />
            </el-select>
          </div>
          <div>
            周
          </div>
        </div>
      </el-card>
  
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span style="font-size: x-large">学生课表</span>
            <el-button type="primary" @click="isDialogShow = true"
              >添加课程</el-button
            >
          </div>
        </template>
        <el-table
          :data="tableData"
          :row-style="{ height: '80px' }"
          :cell-style="cellStyle"
          :header-cell-style="{ 'text-align': 'center' }"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="id" label="节次/周次" width="100" />
  
          <el-table-column prop="mon" label="周一"></el-table-column>
          <el-table-column prop="tue" label="周二">
            <template #default="scope">
              <el-popover
                effect="light"
                trigger="hover"
                placement="right"
                width="auto"
              >
                <template #default v-if="scope.row[scope.column.property]">
                  <div>
                    课程名称:
                    {{
                      courseData[scope.row.row][scope.column.property].courseName
                    }}
                  </div>
                  <div>
                    教师姓名:
                    {{ courseData[scope.row.row][scope.column.property].teacher }}
                  </div>
                  <div
                    v-if="courseData[scope.row.row][scope.column.property].place"
                  >
                    上课地点:
                    {{ courseData[scope.row.row][scope.column.property].place }}
                  </div>
                  <div>
                    学分:
                    {{ courseData[scope.row.row][scope.column.property].score }}
                  </div>
                </template>
                <template #reference>
                  <div>{{ scope.row[scope.column.property] }}</div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="wed" label="周三" />
          <el-table-column prop="thu" label="周四" />
          <el-table-column prop="fri" label="周五" />
          <el-table-column prop="sat" label="周六" />
          <el-table-column prop="sun" label="周日" />
        </el-table>
      </el-card>
    </div>
    <el-dialog
      v-model="isDialogShow"
      title="添加课程"
      :show-close="false"
      :destroy-on-close="true"
    >
      <!-- 关闭点击×关闭 -->
      <el-form :rules="rules" :model="modalContent" ref="form">
        <el-row>
          <el-col :span="11"
            ><el-form-item label="课程名称" prop="courseName"
              ><el-input
                v-model="modalContent.courseName"
              ></el-input></el-form-item
          ></el-col>
          <el-col :span="11" :offset="2"
            ><el-form-item label="上课地点" prop="place"
              ><el-input v-model="modalContent.place"></el-input></el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"
            ><el-form-item label="教师姓名" prop="teacher"
              ><el-input v-model="modalContent.teacher"></el-input></el-form-item
          ></el-col>
          <el-col :span="5" :offset="1"
            ><el-form-item label="学分" prop="score"
              ><el-input v-model="modalContent.score"></el-input></el-form-item
          ></el-col>
          <el-col :span="9" :offset="1"
            ><el-form-item label="课号" prop="courseId"
              ><el-input v-model="modalContent.courseId"></el-input></el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上课时间" prop="weekday">
              <el-select v-model="modalContent.weekday" placeholder="星期">
                <el-option
                  v-for="item in week"
                  :value="item"
                  :key="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1"
            ><el-form-item prop="startTime">
              <el-select v-model="modalContent.startTime" placeholder="开始节次">
                <el-option
                  v-for="item in modalContent.endTime
                    ? classTime.slice(0, modalContent.endTime - 1)
                    : classTime"
                  :value="item"
                  :key="item"
                  :label="item"
                /> </el-select></el-form-item
          ></el-col>
          <el-col :span="7" :offset="1"
            ><el-form-item prop="endTime">
              <el-select v-model="modalContent.endTime" placeholder="结束节次">
                <el-option
                  v-for="item in modalContent.startTime
                    ? classTime.slice(modalContent.startTime)
                    : classTime"
                  :value="item"
                  :key="item"
                  :label="item"
                /> </el-select></el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="课程周次" prop="weekType">
              <el-select v-model="modalContent.weekType" placeholder="单双周">
                <el-option
                  v-for="item in weekType"
                  :value="item"
                  :key="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item prop="startWeek">
              <el-select v-model="modalContent.startWeek" placeholder="开始周次">
                <el-option
                  v-for="item in modalContent.endWeek
                    ? weekNum.slice(0, modalContent.endWeek - 1)
                    : weekNum"
                  :value="item"
                  :key="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item prop="endWeek">
              <el-select v-model="modalContent.endWeek" placeholder="结束周次">
                <el-option
                  v-for="item in modalContent.startWeek
                    ? weekNum.slice(modalContent.startWeek)
                    : weekNum"
                  :value="item"
                  :key="item"
                  :label="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer" slot="footer">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="confirm()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { ref } from "vue";
  const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const weekNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const classTime = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const weekType = ["单周", "双周", "全部"];
  const rules = ref({
    courseName: [{ required: true, message: "请填写课程名称", trigger: "blur" }],
    teacher: [{ required: true, message: "请填写教师姓名", trigger: "blur" }],
    score: [{ required: true, message: "请填写课程学分", trigger: "blur" }],
    courseId: [{ required: true, message: "请填写课号", trigger: "blur" }],
    weekday: [
      {
        required: true,
        message: "请选择上课的星期",
      },
    ],
    startTime: [
      {
        required: true,
        message: "请选择课程的开始节次",
      },
    ],
    endTime: [
      {
        required: true,
        message: "请选择课程的结束节次",
      },
    ],
    weekType: [
      {
        required: true,
        message: "请选择课程是否为单双周",
      },
    ],
    startWeek: [
      {
        required: true,
        message: "请选择课程的开始周次",
      },
    ],
    endWeek: [
      {
        required: true,
        message: "请选择课程的结束周次",
      },
    ],
  });
  export default {
    name: "",
    data() {
      return {
        week,
        weekNum,
        classTime,
        weekType,
        rules,
        tableData: [],
        courseData: [],
        isDialogShow: false,
        weekQuery: null,
        modalContent: {
          teacher: "", //教师
          courseName: "", //课程名称
          courseId: "", //课号
          startWeek: null, //开始周次
          endWeek: null, //结束周次
          weekType: null, //单双周
          weeks: [], //上课的周
          place: "", //地点
          startTime: null, //开始节次
          endTime: null, //结束节次
          weekday: null, //周几
          score: null, //学分
        },
      };
    },
    created() {
      //先初始化
      for (var i = 0; i < 12; i++) {
        this.tableData.push({
          id: "第" + (i + 1) + "节",
          row: i,
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
          sun: null,
        });
        this.courseData.push({
          id: "第" + (i + 1) + "节",
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
          sun: null,
        });
      }
      //在这里添加对后端的数据进行解析的函数
      this.courseData[1].tue = {
        teacher: "魏巍",
        courseName: "体育(4)",
        courseId: "32000407",
        startWeek: 1,
        endWeek: 17,
        place: "体育中心健身房",
        startTime: 2,
        endTime: 3,
        score: "1.0",
      };
      for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 7; j++) {
          this.tableData[i][week[j]] = this.showInfo(this.courseData[i][week[j]]);
        }
      }
      this.doQuery()
    },
    mounted() {
      console.log(`the component is now mounted.`);
    },
    methods: {
      doQuery() {
        //向后端索要信息，每次dom更新都调用
        if(this.weekQuery){
  //2.20
        }
        else{
          var today = new Date()
          var startDate = Date.parse('2023-02-20')
          var days=(today - startDate)/(1*24*60*60*1000);        
          this.weekQuery = parseInt(days / 7 + 1)
        }
      },
      showInfo(data) {
        var s = "";
        if (data) {
          s += data.teacher + " ";
          s += data.courseName + " ";
          s += "(" + data.courseId + ") ";
          s += "[" + data.startWeek + "-" + data.endWeek + "] ";
          s += data.place;
        }
        return s;
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (
          columnIndex !== 0 &&
          this.courseData[rowIndex][week[columnIndex - 1]]
        ) {
          if (
            rowIndex ===
            this.courseData[rowIndex][week[columnIndex - 1]].startTime - 1
          ) {
            return {
              rowspan:
                this.courseData[rowIndex][week[columnIndex - 1]].endTime -
                this.courseData[rowIndex][week[columnIndex - 1]].startTime +
                1,
              colspan: 1,
            };
          }
        }
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (
          columnIndex !== 0 &&
          this.courseData[rowIndex][week[columnIndex - 1]]
        ) {
          if (
            rowIndex ===
            this.courseData[rowIndex][week[columnIndex - 1]].startTime - 1
          ) {
            return {
              background: "rgb(122,122,249)",
              textAlign: "center",
              color: "white",
              borderRadius: "12px",
              border: "8px solid",
            };
          }
        }
        return { textAlign: "center" };
      },
      confirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // Submit form data
            this.$message({
              message: "上传成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "请填写必要信息",
              type: "error",
            });
            return false;
          }
        });
      },
      cancel() {
        this.isDialogShow = false;
        this.modalContent = {
          teacher: "", //教师
          courseName: "", //课程名称
          courseId: "", //课号
          startWeek: null, //开始周次
          endWeek: null, //结束周次
          weekType: null, //单双周
          weeks: [], //上课的周
          place: "", //地点
          startTime: null, //开始节次
          endTime: null, //结束节次
          weekday: null, //周几
          score: "", //学分
        };
      },
    },
  };
  </script>
  
  <style>
  .box-card {
    width: 1200px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dialog-footer {
    justify-content: flex-end;
  }
  
  .dialog-footer button {
    margin-right: 10px;
  }
  </style>
  