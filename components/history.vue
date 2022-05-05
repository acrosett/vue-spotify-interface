 <template>
  <div class="history-wrapper">
    <v-chip
      v-for="(item, key) in $store.state.list"
      :key="key"
      close
      @click:close="$store.commit('removeArtist', item)"
      @click="$emit('select', item)"
    >
      {{ item.name }}
    </v-chip>
  </div>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {};
  },
  methods: {},
  watch: {},
};
</script>

<style lang="scss">
.history-wrapper {
  text-align: center;
  margin-top: 2em;
  height: fit-content;
  min-height: 2em;
  .v-chip {
    margin: 0.3em;
    width: fit-content;
  }
}
</style>