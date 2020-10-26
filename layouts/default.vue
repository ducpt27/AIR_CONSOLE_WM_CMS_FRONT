<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :fixed="fixed"
      width="auto"
      app
    >
      <v-list>
        <!--        <v-list-item-->
        <!--          v-for="(item, i) in items"-->
        <!--          :key="i"-->
        <!--          :to="item.to"-->
        <!--          router-->
        <!--          exact-->
        <!--        >-->
        <!--          <v-list-item-action>-->
        <!--            <v-icon>{{ item.icon }}</v-icon>-->
        <!--          </v-list-item-action>-->
        <!--          <v-list-item-content>-->
        <!--            <v-list-item-title v-text="item.title" />-->
        <!--          </v-list-item-content>-->
        <!--        </v-list-item>-->
        <v-list-group
          v-for="item in items"
          :key="item.title"
          :prepend-icon="item.action"
          :to="item.to"
        >
          <template v-slot:activator>
            <v-list-item-action style="margin-right: 16px">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
            style="padding-left: 32px"
          >
            <v-list-item-action style="margin-right: 16px">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="child.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-menu min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large right style="margin-left: auto" v-on="on">
            <v-avatar color="primary" size="48">
              <span class="white--text headline">Đ</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="primary">
                <span class="white--text headline">Đ</span>
              </v-avatar>
              <h3>Phạm Trung Đức</h3>
              <p class="caption mt-1">ducpham27022k@gmail.com</p>
              <v-divider class="my-3"></v-divider>
              <v-btn text color="primary"> Thông tin tài khoản</v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn text color="brown"> Đăng xuất</v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account-group',
          title: 'Nhóm người dùng',
          items: [
            {
              icon: 'mdi-account',
              title: 'Tài khoản',
              to: '/danh-sach-tai-khoan',
            },
          ],
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Bộ câu hỏi',
          items: [
            {
              icon: 'mdi-apps',
              title: 'Danh sách',
              to: '/bo-cau-hoi',
            },
          ],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
}
</script>
