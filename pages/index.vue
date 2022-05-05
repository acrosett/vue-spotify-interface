<template>
  <div class="app-wrapper">
    <history @select="selectArtist"></history>
    <h2>Search artist</h2>
    <v-toolbar dense floating>
      <v-text-field
        v-on:click="resetAlbumData()"
        v-model="search"
        hide-details
        prepend-icon="mdi-magnify"
        single-line
      ></v-text-field>
    </v-toolbar>
    <!-- Artist list -->
    <v-simple-table v-if="artistSelected == null">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="table-header" v-on:click="sortByName = !sortByName">
              Name
            </th>
            <th
              class="table-header"
              v-on:click="sortByFollowers = !sortByFollowers"
            >
              Followers
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-on:click="selectArtist(item)"
            v-for="(item, key) in displayResults"
            :key="key"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.followers.total }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <album-view
      v-if="artistSelected"
      :artistSelected="artistSelected"
      :albums="albums"
    ></album-view>
  </div>
</template>

<script>
import albumView from "../components/albumView.vue";
import History from "../components/history.vue";
export default {
  components: { albumView, History },
  mounted() {},
  data() {
    return {
      search: "",
      results: [],
      displayResults: [],
      searchTimeout: null,
      artistSelected: null,
      albums: [],
      sortByFollowers: true,
      sortByName: true,
    };
  },
  methods: {
    logToken() {
      this.$spotifyService.logAuthToken();
    },
    selectArtist(item) {
      console.log(item);
      this.artistSelected = item.id;
      this.$store.commit("addArtist", item);
    },
    resetAlbumData() {
      this.artistSelected = null;
      this.albums = [];
    },
  },
  watch: {
    search() {
      this.resetAlbumData();

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.$spotifyService.searchArtist(this.search).then((res) => {
          this.results = res.data.artists.items;

          this.displayResults = this.results;
        });
      }, 400);
    },
    artistSelected() {
      if (this.artistSelected == null) {
        return;
      }
      this.$spotifyService.getArtistAlbums(this.artistSelected).then((res) => {
        //Remove duplicates
        let names = [];
        this.albums = res.data.items.filter(function (item, pos) {
          if (names.includes(item.name)) {
            return false;
          }
          names.push(item.name);
          return true;
        });
      });
    },
    sortByName() {
      if (this.sortByName) {
        this.displayResults.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      } else {
        this.displayResults.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
          if (a.name < b.name) {
            return 1;
          }
          return 0;
        });
      }
    },
    sortByFollowers() {
      if (this.sortByFollowers) {
        this.displayResults.sort((a, b) => {
          if (a.followers.total > b.followers.total) {
            return -1;
          }
          if (a.followers.total < b.followers.total) {
            return 1;
          }
          return 0;
        });
      } else {
        this.displayResults.sort((a, b) => {
          if (a.followers.total < b.followers.total) {
            return -1;
          }
          if (a.followers.total > b.followers.total) {
            return 1;
          }
          return 0;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.app-wrapper {
  text-align: center;
  margin: 10em;
  margin-top: 2em;

  h2 {
    margin: 1em;
  }

  .v-toolbar {
    width: 100%;
    .v-toolbar__content {
      width: 100%;
    }
  }

  .table-header {
    width: 50%;
  }
  .v-image {
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
}
</style>