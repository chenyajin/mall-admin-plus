<!--
 * @Author: 陈亚金
 * @Date: 2023-12-27 14:17:09
 * @LastEditors: 陈亚金
 * @LastEditTime: 2023-12-27 23:11:01
 * @Description: 添加或修改门店对话框
-->
<template>
  <div class="app-container">
    <el-dialog
      :title="dialogData.title"
      :visible.sync="dialogData.show"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
      @open="visibleShow"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="门店名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="主管人员" prop="contact">
          <el-select v-model="form.contact" filterable clearable placeholder="请输入主管名称">
            <el-option
              v-for="item in directorList"
              :value="'' + item.userId"
              :label="item.userName"
              :key="'' + item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详情地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="营业时间" prop="openingTime">
          <el-time-picker
            is-range
            v-model="businessHour"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="门店图片" prop="logo">
          <imageUpload v-model="form.logo" />
        </el-form-item>
        <el-form-item label="门店简介" prop="detail">
          <editor v-model="form.shopDetail" :min-height="192" :height="500" />
        </el-form-item>
        <el-form-item label="上架项目">
          <el-select v-model="itemIds" multiple placeholder="请上架项目" clearable size="small" class="w-full">
            <el-option v-for="dict in tableData" :key="dict.id" :label="dict.itemName" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{
              dict.dictLabel
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUsersByRoleKey } from "@/api/system/user";
import { getShopInfo, addShopInfo, updateShopInfo } from "@/api/shop/shopinfo";
import { listItem } from "@/api/shop/item";

export default {
  name: "ShopDetail",
  props: {
    modalData: {
      type: Object,
      default: {
        show: false,
        title: "",
        row: {}
      }
    }
  },
  data() {
    return {
      dialogData: {
        show: false,
        title: ""
      },
      form: {},
      businessHour: ["", ""],
      itemIds: [],
      rules: {
        shopName: [
          {
            required: true,
            message: "请输入店铺名称",
            trigger: "blur"
          }
        ],
        contact: [
          {
            required: true,
            message: "请选择主管人员",
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            message: "请填写联系方式",
            trigger: "blur"
          }
        ]
      },
      directorList: [],
      tableData: []
    };
  },
  watch: {
    modalData: {
      handler(value) {
        this.dialogData = value;
      },
      deep: true
    }
  },
  methods: {
    visibleShow() {
      this.getTableDataList();
      this.getDirectorList();
      this.getDicts("sys_yes_no").then(response => {
        this.statusOptions = response.data;
      });
    },
    getTableDataList() {
      listItem().then(res => {
        this.tableData = res.rows;
      });
    },
    getShopDetail() {
      this.reset();
      const id = this.dialogData.row.id;
      if (id) {
        return;
      }
      getShopInfo(id).then(response => {
        this.form = response.data;
        this.businessHour = response.data.openingTime
          ? [response.data.openingTime, response.data.closingTime]
          : ["", ""];
        this.itemIds = this.form.baseShopItemConsultantList.map(item => String(item.itemId));
      });
    },
    getDirectorList() {
      getUsersByRoleKey("director").then(res => {
        this.directorList = res.data;
      });
    },
    /** 提交按钮 */
    submitForm() {
      const baseShopItemConsultantList = this.itemIds
        .filter(item => !!item)
        .map(item => {
          return {
            itemId: item,
            consultantId: ""
          };
        });
      this.form.baseShopItemConsultantList = baseShopItemConsultantList;
      if (this.businessHour.length) {
        this.form.openingTime = this.businessHour[0];
        this.form.closingTime = this.businessHour[1];
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateShopInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              // this.open = false;
              // this.getList();
            });
          } else {
            addShopInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              // this.open = false;
              // this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogData.show = false;
      this.$emit("close");
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        shopName: null,
        shopDetail: null,
        address: null,
        contact: null,
        phone: null,
        status: "Y",
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        baseShopItemConsultantList: []
      };
      this.resetForm("form");
    }
  }
};
</script>
