<template>
  <div class="card-main">
    <el-card style="margin-bottom: 15px; margin-top: 15px">
      <el-row>
        <el-col :span="1"
          ><el-button @click="subWeek"
            ><el-icon><ArrowLeft /></el-icon></el-button
        ></el-col>
        <el-col :span="2"
          ><div style="margin-top: 5px; margin-left: 15px">
            第&nbsp{{ weekQuery }}&nbsp周
          </div></el-col
        >
        <el-col :span="1"
          ><el-button @click="addWeek"
            ><el-icon><ArrowRight /></el-icon></el-button
        ></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="font-size: x-large">我的课表</span>
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
        @cell-click="deleteCourse"
      >
        <el-table-column prop="id" label="节次/周次" width="100" />

        <el-table-column prop="mon" label="周一"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
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
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="wed" label="周三"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
        <el-table-column prop="thu" label="周四"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
        <el-table-column prop="fri" label="周五"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
        <el-table-column prop="sat" label="周六"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
        <el-table-column prop="sun" label="周日"
          ><template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default v-if="scope.row[scope.column.property]">
                <div>
                  课号:
                  {{
                    courseData[scope.row.row][scope.column.property].courseId
                  }}
                </div>
                <div>
                  学分:
                  {{ courseData[scope.row.row][scope.column.property].score }}
                </div>
                <div>
                  周次:
                  {{  courseData[scope.row.row][scope.column.property].startWeek + ' - ' + courseData[scope.row.row][scope.column.property].endWeek  }}
                </div>
                <div>
                  节次:
                  {{  courseData[scope.row.row][scope.column.property].startTime + ' - ' + courseData[scope.row.row][scope.column.property].endTime  }}
                </div>
              </template>
              <template #reference>
                <div>{{ scope.row[scope.column.property] }}</div>
              </template>
            </el-popover>
          </template></el-table-column
        >
      </el-table>
    </el-card>
    <el-affix
      position="bottom"
      :offset="40"
      style="float: right; margin-right: 15px"
    >
      <el-upload
        id="fileUpload"
        name="curriculum"
        action="/api/curriculum/upload"
        :data="myHeaders"
        accept=".pdf"
        :on-success="handleSuccess"
      >
        <el-popover trigger="hover" placement="left" content="上传课表文件">
          <template #reference>
            <el-button type="primary" circle size="large"
              ><el-icon><Plus /></el-icon
            ></el-button>
          </template>
        </el-popover>
      </el-upload>
    </el-affix>
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
                v-for="item in weekChi"
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
import { markRaw } from "vue";
import axios from "axios";
import { ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const weekChi = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
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
      weekChi,
      weekNum,
      classTime,
      weekType,
      rules,
      tableData: [],
      courseData: [],
      isDialogShow: false,
      weekQuery: null,
      myHeaders: null,
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
    this.myHeaders = { token: localStorage.getItem("token") };
    console.log(this.myHeaders.token);
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
    this.doQuery();
  },
  mounted() {
  },
  methods: {
    async doQuery() {
      //向后端索要信息，每次dom更新都调用
      for (var i = 0; i < 12; i++) {
        this.tableData[i] = {
          id: "第" + (i + 1) + "节",
          row: i,
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
          sun: null,
        };
        this.courseData[i] = {
          id: "第" + (i + 1) + "节",
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
          sun: null,
        };
      }
      if (!this.weekQuery) {
        var today = new Date();
        var startDate = Date.parse("2023-02-20");
        var days = (today - startDate) / (1 * 24 * 60 * 60 * 1000);
        this.weekQuery = parseInt(days / 7 + 1);
      }
      var response;
      try {
        response = await axios.post("/api/curriculum/getweekcourses", {
          token: localStorage.getItem("token"),
          weekId: this.weekQuery,
        });
      } catch (err) {
        console.log(err);
        return;
      }
      console.log(response.data);
      for (var i = 0; i < response.data.courses.length; i++) {
        var temp = response.data.courses[i];
        // console.log(temp.startTime,temp.endTime,temp.weekday,temp.teacher);
        this.courseData[temp.startTime - 1][temp.weekday] = temp;
        this.courseData[temp.startTime - 1][temp.weekday].startWeek =
          temp.weeks[0];
        this.courseData[temp.startTime - 1][temp.weekday].endWeek =
          temp.weeks[temp.weeks.length - 1];
        console.log(
          this.courseData[temp.startTime - 1][temp.weekday],
          this.courseData[temp.startTime - 1][temp.weekday].weekday
        );
      }
      for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 7; j++) {
          this.tableData[i][week[j]] = this.showInfo(
            this.courseData[i][week[j]]
          );
        }
      }
    },
    showInfo(data) {
      var s = "";
      if (data) {
        s += data.courseName + "\n\n";
        s += data.teacher + "\n";
        s += data.place;
      }
      return s;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row,column)
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
      } else if (columnIndex !== 0) {
        for (var i = 0; i < rowIndex; i++) {
          if (this.courseData[i][week[columnIndex - 1]]) {
            if (
              this.courseData[i][week[columnIndex - 1]].endTime - 1 >=
              rowIndex
            ) {
              return {
                rowspan: 0, //清除就是这俩属性设置为0
                colspan: 0, //清除就是这俩属性设置为0
              };
            }
          }
        }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // console.log(this.tableData[rowIndex][week[columnIndex - 1]])
      // console.log(week[columnIndex - 1],column.property)
      if (
        columnIndex !== 0 &&
        this.courseData[rowIndex][week[columnIndex - 1]]
      ) {
        console.log(
          week[columnIndex - 1],
          column.property,
          this.courseData[rowIndex][week[columnIndex - 1]].teacher
        );
        // console.log(
        //   this.tableData[rowIndex][week[columnIndex - 1]],
        //   rowIndex,
        //   columnIndex
        // );
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
    clearModal() {
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
    async confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(
            this.modalContent.startWeek,
            this.modalContent.endWeek,
            this.modalContent.weekType
          );
          for (
            var i = this.modalContent.startWeek;
            i <= this.modalContent.endWeek;
            i++
          ) {
            if (this.modalContent.weekType == "全部") {
              this.modalContent.weeks.push(i);
            } else if (this.modalContent.weekType == "单周" && i % 2) {
              this.modalContent.weeks.push(i);
            } else if (this.modalContent.weekType == "双周" && i % 2 == 0) {
              this.modalContent.weeks.push(i);
            }
          }
          this.modalContent.weekday = week[weekChi.findIndex(element => (element === this.modalContent.weekday))]
          var response;
          try {
            response = await axios.post("/api/curriculum/create", {
              token: localStorage.getItem("token"),
              course: this.modalContent,
            });
          } catch (err) {
            console.log(err);
            this.$message({
              message: err.response.data.msg,
              grouping: false,
              type: "error",
            });
            return;
          }
          console.log(response);
          this.clearModal();
          this.$message({
            message: "上传成功!",
            type: "success",
          });
          this.isDialogShow = false;
        } else {
          this.$message({
            message: "请填写必要信息",
            type: "error",
          });
          return false;
        }
        this.doQuery();
      });
    },
    cancel() {
      this.isDialogShow = false;
      this.clearModal();
    },
    subWeek() {
      if (this.weekQuery >= 2) this.weekQuery -= 1;
      this.doQuery();
    },
    addWeek() {
      if (this.weekQuery <= 16) this.weekQuery += 1;
      this.doQuery();
    },
    deleteCourse(row, column) {
      console.log(this.courseData[row.row][column.property]);
      if (this.courseData[row.row][column.property]) {
        var response;
        ElMessageBox.confirm("删除后不可恢复，是否继续？", "提示", {
          type: "warning",
          icon: markRaw(Delete),
        }).then(async () => {
          try {
            response = await axios.post("/api/curriculum/delete", {
              token: localStorage.getItem("token"),
              id: this.courseData[row.row][column.property].id,
            });
          } catch (err) {
            console.log(err);
            this.$message({
              message: err.response.data.msg,
              grouping: false,
              type: "error",
            });
            return;
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.doQuery();
        });
      }

      console.log(this.courseData[row.row][column.property]);
    },
    handleSuccess(res) {
      console.log(res);
      this.doQuery();
    },
  },
};
</script>
  
  <style>
.card-main {
  margin: auto;
  display: block;
}

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

.el-message-box__status.el-message-box-icon--warning {
  --el-messagebox-color: rgb(122, 122, 249);
  color: var(--el-messagebox-color);
}

.el-table .cell{
    white-space: pre-line;
  }
</style>
  