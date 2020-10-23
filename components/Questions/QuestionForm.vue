<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="editedItem.name"
              label="Dessert name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="editedItem.calories"
              label="Calories"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="editedItem.fat"
              label="Fat (g)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="editedItem.carbs"
              label="Carbs (g)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="editedItem.protein"
              label="Protein (g)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close"> Đóng</v-btn>
      <v-btn color="blue darken-1" text @click="save"> Lưu</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        name: 'hello',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    },
  },
  methods: {
    onSave() {},
  },
}
</script>
