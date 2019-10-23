<template>
  <v-container fluid grid-list-md v-if="infiniteScrollPosts">
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img :src="post.imageUrl" height='30vh' lazy ></v-img>
          <v-card-actions>
            <v-card-title>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} スキ  - {{post.messages.length}} コメント</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click='showPostCreator = !showPostCreator'>
              <v-icon>{{`keyboard_arrow_${showPostCreator ? 'up' : 'down '}`}}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list avatar>
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="post.createdBy.avatar">
                  </v-list-item-avatar>
                  <v-list-item-title>
                    {{post.createdBy.username}}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{post.createdDate}}
                  </v-list-item-subtitle>
                  <v-list-item-action>
                    <v-btn icon ripple>
                      <v-icon color="grey lighten-1">info</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout column v-if="showMoreEnabled">
      <v-flex xs12>
        <v-layout justify-center>
          <v-btn color="info" @click="showMorePosts">Show More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {INFINITE_SCROLL_POSTS} from '../../queries'

const pageSize = 2;
export default {
  name: 'Posts',
  data(){
    return{
      pageNum:1,
      showMoreEnabled: true,
      showPostCreator: false
    }
  },
  apollo:{
    infiniteScrollPosts:{
      query: INFINITE_SCROLL_POSTS,
      variables:{
        pageNum:1,
        pageSize
      }
    }
  },
  methods:{
    showMorePosts(){
      this.pageNum += 1
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables:{
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, {fetchMoreResult})=> {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          console.log(prevResult.infiniteScrollPosts);
          console.log(fetchMoreResult);
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts:{
              __typename: prevResult.infiniteScrollPosts.__typename,
              posts:[
                ...prevResult.infiniteScrollPosts.posts,
                ...newPosts
              ],
              hasMore
            }
          }
        }
      })
    }
  }
}
</script>