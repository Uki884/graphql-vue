<template>
  <v-container class="text-center" mt-5 pt-5>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <h1 class="primary--text">新規投稿</h1>
    </v-flex>
  </v-layout>

<v-layout row wrap>
  <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" @submit.prevent="handleAddPost" lazy-validation ref="form">
          <!-- タイトル -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="タイトル" type="text" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- 画像 -->
          <v-layout row>
          <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" label="画像" type="text" required></v-text-field>
            </v-flex>
          </v-layout>
          <!-- 画像プレビュー -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px" >
            </v-flex>
          </v-layout>
          <!-- カテゴリー -->
          <v-layout row>
            <v-flex xs12>
              <v-select :rules="categoriesRules" v-model="categories" :items="['art','education','科学']" multiple label="カテゴリー"></v-select>
            </v-flex>
          </v-layout>
          <!-- 説明 -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="説明" type="text" required></v-textarea>
            </v-flex>
          </v-layout>
          <!-- 登録ボタン -->
          <v-layout row>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isFormValid || loading " color="info" type="submit">
                <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
                </span>
                登録</v-btn>
              </v-flex>
          </v-layout>
        </v-form>
  </v-flex>

</v-layout>
</v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'AddPost',
  data(){
    return {
      isFormValid: true,
      title: "",
      imageUrl:"",
      categories:[],
      description:"",
      titleRules:[
        title => !!title || "タイトルを入力してください",
        title => title.length < 10 || "タイトルは20文字以下で入力してください",
      ],
      imageRules:[
        image => !!image || "画像を選択してください",
      ],
      categoriesRules:[
        categories => categories.length >= 1 || "カテゴリーを1つ以上選択してください",
      ],
      descRules:[
        desc => !!desc || "説明を入力してください",
        desc => desc.length < 200 || "説明は200文字以下で入力してください",
      ],
    }
  },
  computed:{
    ...mapGetters(['loading','user'])
  },
  methods:{
    handleAddPost(){
      if (this.$refs.form.validate()){
        this.$store.dispatch('addPost',{
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push('/');
      }
    }
  }
}
</script>