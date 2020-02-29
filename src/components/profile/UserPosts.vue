<template>
  <div class="d-flex flex-wrap bd-highlight">
    <div
      class="user-post bd-highlight"
      v-for="post in posts"
      :key="post.postId"
    >
      <router-link :to="`/post/${post.postId}`">
        <img :src="post.image" alt="Post by the user" class="w-100" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style>
.user-post {
  padding: 2px;
  flex: 1 0 33%;
  /* width: calc(100% * (1 / 3)); */
}
</style>
