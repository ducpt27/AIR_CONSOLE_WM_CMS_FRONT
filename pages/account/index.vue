<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="accounts"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      fixed-header
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.isAdmin="{ item }">
        <v-chip :color="getColor(item.isAdmin, 'isAdmin')" dark outlined>
          {{ item.isAdmin === 1 ? 'Admin' : 'Tắt' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <h3>Danh sách tài khoản</h3>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="780px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Thêm mới
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.name"
                        auto-grow
                        rows="1"
                        row-height="15"
                        label="Họ và tên"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.username"
                        auto-grow
                        rows="1"
                        row-height="15"
                        label="Tên đăng nhập"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="editedItem.password"
                        label="Mật khẩu"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="editedItem.rePassword"
                        label="Mật khẩu"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-switch
                        v-model="editedItem.isAdmin"
                        :label="`${editedItem.isAdmin === true ? 'Admin' : ''}`"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close"> Đóng</v-btn>
                <v-btn color="primary" dark @click="save"> Lưu</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="260px">
            <v-card>
              <v-card-title class="justify-center"
                >Bạn có chắc chắn muốn xóa?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Hủy
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >Đồng ý
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="darken-1" @click="initialize"> Reset</v-btn>
      </template>
    </v-data-table>
    <div style="margin: 15px 0; text-align: right">
      <v-pagination
        v-model="page"
        style="padding: 0 10px"
        class="d-inline-block"
        :length="pageCount"
      ></v-pagination>
      <v-select
        class="d-inline-block"
        style="padding: 0 10px; width: 100px"
        :items="itemsPerPageList"
        :value="itemsPerPage"
        label="Bản ghi"
        dense
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-select>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    itemsPerPageList: [5, 10, 20, 50, 100, 150, 300],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Tên đăng nhập', value: 'username' },
      { text: 'Họ và tên', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Admin', value: 'isAdmin' },
      { text: '', width: '100px', value: 'actions', sortable: false },
    ],
    accounts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      username: '',
      email: '',
      isAdmin: false,
      rePassword: '',
    },
    defaultItem: {
      name: '',
      username: '',
      email: '',
      isAdmin: false,
      rePassword: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tạo mới' : 'Cập nhật'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      try {
        const response = await this.$axios.get(
          'users?channel=cms&transId=2hmk3k'
        )
        this.accounts = response.data.data
        if (this.accounts != null) {
          for (let i = 0; i < this.accounts.length; i++) {
            this.accounts[i].createAt = this.format_date(
              this.accounts[i].createAt
            )
            this.accounts[i].updateAt = this.format_date(
              this.accounts[i].updateAt
            )
          }
        }
      } catch (e) {
        this.error = 'Lỗi hệ thống.'
      }
    },

    editItem(item) {
      this.editedIndex = this.accounts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.accounts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      try {
        const response = await this.$axios.delete('users/' + this.editedItem.id)
        if (response.data.code === 0) {
          await this.initialize()
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        try {
          const response = await this.$axios.put(
            'users/' + this.editedItem.id,
            this.editedItem
          )
          // eslint-disable-next-line no-console
          await console.log(response.data)
          await this.initialize()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }
        // Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        try {
          const response = await this.$axios.post('users', this.editedItem)
          // eslint-disable-next-line no-console
          await console.log(response.data)
          await this.initialize()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }
        // this.desserts.push(this.editedItem)
      }
      this.close()
    },

    getColor(val1, field) {
      if (field === 'isAdmin') {
        if (val1 === 0) return 'white'
        else return 'green'
      }
    },

    format_date(value) {
      if (value) {
        return moment(String(value)).format('hh:mm:ss DD/MM/yyyy')
      }
    },
  },
}
</script>
