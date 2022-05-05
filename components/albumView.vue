 <template>
  <v-app>
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
            //This is needed for vue to update the view on array change
            this.$set(this.albumsTracks, this.carouselModel, res.data.items);
          });
      }
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
