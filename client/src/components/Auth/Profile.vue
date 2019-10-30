<template>
    <v-container class="text-center">
      <v-flex sm6 offset-sm3>
        <v-card class="white--text" color="secondary">
          <v-layout>
            <v-flex xs5>
              <v-img height="125px" contain :src="user.avatar"></v-img>
            </v-flex>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{user.username}}</div>
                  <div> 登録日 {{user.joinDate}}</div>
                  <div class="hidden-xs-only font-weight-thin">({{user.favorites.length}}) お気に入り</div>
                  <div class="hidden-xs-only font-weight-thin">{{userPosts.length}} 投稿</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
        <v-container v-if="!user.favorites.length">
        <v-layout row wrap >
          <v-flex xs12>
            <h2>まだ何もお気に入りしてません。</h2>
          </v-flex>
            </v-layout>
        </v-container>
            <div class="mt-3" v-else>
              <v-flex xs12>
                <h2 class="font-weigth-thin">お気に入り
                  <span class="font-weight-thin">({{user.favorites.length}})</span>
                </h2>
              </v-flex>
              <v-layout row wrap>
                <v-flex xs12 sm6 v-for="favorite in user.favorites" :key="favorite._id">
                  <v-card class="mt-3 ml-1 mr-2" hover>
                    <v-img height="30vh" :src="favorite.imageUrl"></v-img>
                    <v-card-text>{{favorite.title}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
      </v-flex>
      <v-container v-if="!userPosts.length">
        <v-layout row wrap>
          <v-flex xs12>
            <h2>まだあなたの投稿が有りません。</h2>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container class="mt-3" v-else>
        <v-flex xs12>
          <h2>あなたの投稿</h2>
          <span> ({{userPosts.length}})</span>
        </v-flex>
        <v-layout row wrap>
          <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
            <v-card class="mt-3 ml-1 mr-2" hover>
              <v-btn color="info" @click="loadPost(post)" floating fab small dark>
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn color="error" @click="handleDeleteUserPost(post)" floating fab small dark>
                <v-icon>delete</v-icon>
              </v-btn>
              <v-img height="30vh" :src="post.imageUrl"></v-img>
              <v-card-text>{{post.title}}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <!-- 編集ダイアログ -->
      <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
        <v-card>
          <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
          <v-container>
        <v-form v-model="isFormValid" @submit.prevent="handleUpdateUserPost" lazy-validation ref="form">
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
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!isFormValid" class="success-text" flat>更新</v-btn>
            <v-btn class="error--text" flat @click="editPostDialog = false">キャンセル</v-btn>
          </v-card-actions>

        </v-form>
        </v-container>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Profile',
  data(){
    return {
      editPostDialog: false,
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
  ...mapGetters(['user','userPosts']),
  },
  created(){
    this.handleGetUserPosts();
  },
  methods:{
    handleGetUserPosts(){
      this.$store.dispatch('getUserPosts',{
        userId: this.user._id
      })
    },
    handleUpdateUserPost(){
      if (this.$refs.form.validate()){
      this.$store.dispatch('updateUserPost',{
        postId: this.postId,
        userId: this.user._id,
        title: this.title,
        imageUrl: this.imageUrl,
        categories: this.categories,
        description: this.description
      });
      this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post){
      this.loadPost(post,false);
      const deletePost = window.confirm('本当に削除しますか？');
      if (deletePost){
        this.$store.dispatch('deleteUserPost',{
          postId: this.postId
        })
      }
    },
    loadPost({_id, title,imageUrl,categories,description},
    editPostDialog = true )
    {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
}
</script>