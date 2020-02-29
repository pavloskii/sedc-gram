<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <button
          class="story-circular"
          :style="`background-image: url(${loggedUser.image})`"
        ></button>
      </div>

      <div class="col-9">
        <p>
          {{ !loggedUser.username ? loggedUser.email : loggedUser.username }}
        </p>
        <button type="button" class="btn btn-light w-100 border">
          Edit Profile
        </button>
      </div>
    </div>
    <hr />
    <div class="row text-center">
      <div class="col-4">
        <strong style="display:block">{{ posts.length }}</strong>
        <small class="from-now">posts</small>
      </div>
      <div class="col-4">
        <strong style="display:block">0</strong>
        <small class="from-now">followers</small>
      </div>
      <div class="col-4">
        <strong style="display:block">0</strong>
        <small class="from-now">following</small>
      </div>
    </div>
    <hr />
    <UserPosts :posts="posts" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserPosts from "@/components/profile/UserPosts.vue";

export default {
  created() {
    this.$store.dispatch("getPosts", { email: this.loggedUser.email });
  },
  methods: {
    deleteAccount() {}
  },
  computed: {
    ...mapState({
      posts: state => state.posts.posts,
      loading: state => state.shared.loading,
      loggedUser: state => state.auth.loggedUser
    })
  },
  components: {
    UserPosts
  }
};
</script>

<style></style>
