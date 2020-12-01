<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="questions"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      fixed-header
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.mile_stone="{ item }">
        <v-chip :color="getColor(item.mile_stone, null)" dark>
          {{ item.mile_stone }}
        </v-chip>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColor(item.status, 'status')" dark outlined>
          {{ item.status === 1 ? 'Bật' : 'Tắt' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <h3>Bộ câu hỏi</h3>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="880px">
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
                        label="Câu hỏi"
                        solo
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="editedItem.info"
                        auto-grow
                        rows="1"
                        row-height="15"
                        label="Thông tin đáp án"
                        solo
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.next_id"
                        label="ID câu tiếp"
                        solo
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-slider
                        v-model="editedItem.mile_stone"
                        dense
                        label="Độ khó"
                        thumb-color="red"
                        thumb-label="always"
                        min="1"
                        max="5"
                        style="height: 50px; padding: 13px 0"
                      ></v-slider>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-switch
                        v-model="editedItem.status"
                        :label="`${editedItem.status === true ? 'Bật' : 'Tắt'}`"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        elevation="2"
                        rounded
                        color="primary"
                        style="margin-right: 12px"
                        dark
                        @click="add_answer()"
                      >
                        Thêm câu trả lời
                      </v-btn>
                    </v-col>

                    <v-col cols="12">
                      <v-radio-group v-model="indexAnswerTrue">
                        <v-row>
                          <v-col
                            v-for="(item, i) in editedItem.answers"
                            :key="item.id"
                            cols="12"
                            md="6"
                            class="radio_answer"
                          >
                            <v-radio
                              :value="i"
                              class="d-inline-block"
                            ></v-radio>
                            <v-text-field
                              v-model="item.name"
                              label="Đáp án"
                              solo
                              class="d-inline-block"
                              style="width: calc(100% - 70px)"
                            ></v-text-field>
                            <v-btn
                              class="d-inline-block"
                              small
                              text
                              icon
                              light
                              color="black"
                              @click="remove_answer(i)"
                            >
                              <v-icon dark> mdi-minus </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-radio-group>
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
      {
        text: 'ID',
        value: 'id',
      },
      { text: 'Câu hỏi', align: 'start', value: 'name' },
      { text: 'Thông tin đáp án', align: 'start', value: 'info' },
      { text: 'Độ khó', value: 'mile_stone' },
      { text: 'Người tạo', value: 'create_by' },
      { text: 'Tạo lúc', value: 'create_at' },
      { text: 'Trạng thái', value: 'status' },
      { text: '', width: '100px', value: 'actions', sortable: false },
    ],
    questions: [],
    answers: [],
    indexAnswerTrue: -1,
    editedIndex: -1,
    editedItem: {
      name: '',
      info: '',
      mile_stone: null,
      next_id: null,
      status: false,
      answers: [],
    },
    defaultItem: {
      name: '',
      info: '',
      mile_stone: null,
      next_id: null,
      status: false,
      answers: [],
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
      this.initialize()
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
          'questions?channel=cms&transId=' +
            this.create_transId() +
            '&page=0&size=0'
        )
        // eslint-disable-next-line no-console
        await console.log(response.data)

        if (response.data.content !== undefined) {
          this.questions = response.data.content
          this.pageCount = response.data.totalPages
          this.itemsPerPage = response.data.size
          this.page =
            response.data.page !== undefined ? response.data.page + 1 : 0
        } else if (response.data.data !== undefined) {
          this.questions = response.data.data
        }
        if (this.questions != null) {
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].create_at = this.format_date(
              this.questions[i].create_at
            )
            this.questions[i].update_at = this.format_date(
              this.questions[i].update_at
            )
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
        this.error = 'Lỗi hệ thống.'
      }
    },

    editItem(item) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = Object.assign({}, item)

      if (this.editedItem !== null) {
        if (
          this.editedItem.answers !== undefined &&
          this.editedItem.answers !== null
        ) {
          for (let j = 0; j < this.editedItem.answers.length; j++) {
            try {
              if (this.editedItem.answers[j].true) {
                this.indexAnswerTrue = j
                break
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e)
            }
          }
        } else {
          this.indexAnswerTrue = -1
        }
      }

      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      // this.questions.splice(this.editedIndex, 1)

      try {
        const response = await this.$axios.delete(
          'questions/' + this.editedItem.id
        )
        // eslint-disable-next-line no-console
        await console.log(response.data)
        await this.initialize()
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
            'questions/' + this.editedItem.id,
            this.map_to_req()
          )
          // eslint-disable-next-line no-console
          await console.log(response.data)
          await this.initialize()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }
      } else {
        try {
          const response = await this.$axios.post(
            'questions',
            this.map_to_req()
          )
          // eslint-disable-next-line no-console
          await console.log(response.data)
          await this.initialize()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }
      }
      this.close()
    },

    getColor(val1, type) {
      if (type === null) {
        if (val1 > 4) return 'red'
        else if (val1 > 3) return 'orange'
        else if (val1 > 2) return 'amber'
        else if (val1 > 0) return 'amber lighten-2'
        else return 'dark'
      } else if (type === 'status') {
        if (val1 === 0) return 'orange'
        else return 'green'
      }
    },

    add_answer() {
      try {
        this.editedItem.answers.push({
          id: null,
          name: '',
          true: false,
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },

    remove_answer(index) {
      try {
        this.editedItem.answers.splice(index, 1)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },

    map_to_req() {
      obj = []
      for (let i = 0; i < this.editedItem.answers.length; i++) {
        const var1 = this.editedItem.answers[i]
        // eslint-disable-next-line eqeqeq
        const isTrue = i === this.indexAnswerTrue
        obj.push({
          id: var1.id,
          name: var1.name,
          // eslint-disable-next-line eqeqeq
          true: isTrue,
        })
      }
      return {
        name: this.editedItem.name,
        info: this.editedItem.info,
        status: this.editedItem.status,
        next_id: this.editedItem.next_id,
        mile_stone: this.editedItem.mile_stone,
        answers: obj,
        channel: 'cms',
        transId: this.create_transId(),
      }
    },

    format_date(value) {
      if (value) {
        return moment(String(value)).format('hh:mm:ss DD/MM/yyyy')
      }
    },

    create_transId() {
      return 'xxxxxx'.replace(/[xy]/g, function (c) {
        const dt = new Date().getTime()
        const r = (dt + Math.random() * 16) % 16 | 0
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    },
  },
}
let obj
</script>
