<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <button
          ref="profile-image"
          class="story-circular"
          :style="`background-image: url(${image})`"
        ></button>
      </div>

      <div class="col-9">
        <span>
          {{ email }}
        </span>
        <label class="text-left btn p-0 btn-link w-100">
          <input type="file" class="d-none" @change="convertImage" />
          Change Profile Image
        </label>
      </div>
    </div>

    <form class="mt-3" novalidate @submit.prevent="updateAccount">
      <div class="form-group">
        <label class="font-weight-bold">Email</label>
        <input
          type="email"
          class="form-control"
          placeholder="Enter email"
          readonly
          :value="email"
        />
      </div>
      <div class="form-group">
        <label class="font-weight-bold">Username</label>
        <input
          type="text"
          class="form-control"
          placeholder="Username"
          v-model="username"
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <hr />
    <button type="button" class="btn btn-dark w-100 mb-3 mt-4" @click="logout">
      Log out
    </button>
    <button
      type="button"
      class="btn btn-danger w-100"
      @click="showModal = true"
    >
      Delete Account
    </button>

    <modal :show="showModal" @close="showModal = false">
      <p slot="header">
        Delete account?
      </p>
      <h6 slot="body" @click="deleteAccount">Ok</h6>
      <h6 slot="footer" @click="showModal = false">Cancel</h6>
    </modal>
  </div>
</template>

<script>
import { convertImageToBase64 } from "../utilities/imageToBase64";

export default {
  data: () => ({
    showModal: false,
    username: "",
    email: "",
    image: ""
  }),
  created() {
    const { username, email, image } = this.$store.state.auth.loggedUser;
    this.username = username;
    this.email = email;
    this.image = image;
  },
  methods: {
    convertImage(e) {
      convertImageToBase64(e.target, 10, 0.1, result => {
        this.$refs["profile-image"].style.backgroundImage = `url(${result})`;
        this.image = result;
      });
    },
    updateAccount() {
      this.$store.dispatch("updateAccount", {
        username: this.username,
        image: this.image
      });
    },
    deleteAccount() {
      this.$store.dispatch("deleteAccount");
    },
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>
