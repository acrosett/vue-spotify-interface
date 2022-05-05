<template>
  <div class="app-wrapper">
    <h2>Search artist</h2>

    <v-toolbar dense floating>
      <v-text-field
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
            <th class="table-header" v-on:click="sortedByName = !sortedByName">
              Name
            </th>
            <th
              class="table-header"
              v-on:click="sortedByFollowers = !sortedByFollowers"
            >
              Followers
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-on:click="artistSelected = item.id"
            v-for="(item, key) in displayResults"
            :key="key"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.followers.total }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-app v-if="artistSelected">
      <v-carousel v-model="carouselModel" hide-delimiters>
        <v-carousel-item v-for="(album, i) in albums" :key="i">
          <h2>{{ album.name }}</h2>
          <v-img
            :src="album.images[0].url"
            max-height="400"
            max-width="400"
          ></v-img>
        </v-carousel-item>
      </v-carousel>

      <!-- Tracks Table -->
      <v-simple-table v-if="albumsTracks[carouselModel]">
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, key) in albumsTracks[carouselModel]" :key="key">
              <td>{{ item.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-app>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      search: "",
      results: [],
      displayResults: [],
      searchTimeout: null,
      artistSelected: null,
      albums: [],
      carouselModel: 0,
      albumsTracks: [],
      sortedByFollowers: true,
      sortedByName: true,
    };
  },
  methods: {
    logToken() {
      this.$spotifyService.logAuthToken();
    },
    updateCarouselModel() {
      if (!this.albumsTracks[this.carouselModel]) {
        this.$spotifyService
          .getAlbumTracks(this.albums[this.carouselModel].id)
          .then((res) => {
            //This is needed for vue to update the view on array change
            this.$set(this.albumsTracks, this.carouselModel, res.data.items);
          });
      }
    },
  },
  watch: {
    search() {
      this.artistSelected = null;
      this.albums = [];
      this.albumsTracks = [];

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
      if(this.artistSelected == null){
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
        this.updateCarouselModel();
      });
    },
    carouselModel() {
      this.updateCarouselModel();
    },

    sortedByName() {
      if (this.sortedByName) {
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

    sortedByFollowers() {
      if (this.sortedByFollowers) {
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