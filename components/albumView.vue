 <template>
  <v-app>
    <div class="album-wrapper">
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
          <thead>
            <tr>
              <th class="table-header">Name</th>
              <th class="table-header">Popularity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in albumsTracks[carouselModel]" :key="key">
              <td>{{ item.name }}</td>
              <td>{{ item.popularity }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
  </v-app>
</template>

<script>
export default {
  mounted() {},
  props: ["albums", "artistSelected"],
  data() {
    return {
      carouselModel: 0,
      albumsTracks: [],
    };
  },
  methods: {
    updateCarouselModel() {
      if (!this.albumsTracks[this.carouselModel]) {
        this.$spotifyService
          .getAlbumTracks(this.albums[this.carouselModel].id)
          .then((res) => {
            let trackIds = res.data.items.map((item) => item.id);
            //We have to call another endpoint to get the tracks with popularity (it is missing in the first call)
            this.$spotifyService.getTracks(trackIds).then((res) => {
              //This is needed for vue to update the view on array change
              let list = res.data.tracks;
              this.sortByPopularity(list);
              this.$set(this.albumsTracks, this.carouselModel, list);
            });
          });
      }
    },
    sortByPopularity(albumsTracks) {
      albumsTracks.sort((a, b) => {
        if (a.popularity > b.popularity) {
          return -1;
        }
        if (a.popularity < b.popularity) {
          return 1;
        }
        return 0;
      });
    },
  },
  watch: {
    carouselModel() {
      this.updateCarouselModel();
    },
    albums: function (newVal, oldVal) {
      this.updateCarouselModel();
    },
  },
};
</script>

<style lang="scss">
.album-wrapper {
  .table-header {
    text-align: center !important;
    width: 50%;
  }
}
</style>
