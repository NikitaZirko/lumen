<template>
  <v-container class="mt-12">
    <v-row no-gutters v-for="(n, i) in films.length" :key="i">
      <v-col cols="12" md="12">
        <v-card
          class="mx-auto my-12 d-flex flex-wrap justify-center align-center"
          max-width="100%"
          color="transparent"
          flat
          tile
        >
          <v-img class="films__img" max-width="200px" :src="films[i] && films[i].url_poster">
            <a href="#" class="triangle-trailer"></a>
          </v-img>
          <div class="films__info">
            <v-card-text class="amber--text" v-if="films[i] && films[i].is_premiere">
              <v-icon small class="pb-2" color="orange darken-2">whatshot</v-icon>ПРЕМЬЕРА
            </v-card-text>

            <v-card-title>{{ films[i] && films[i].title }}</v-card-title>

            <v-card-text>
              <div
                class="d-inline comma"
                v-for="(ge, g) in films[i].genres.length"
                :key="g"
              >{{ films[i] && films[i].genres[g].title }}</div>
            </v-card-text>
          </div>

          <div class="films__schedule">
            <v-card-text>
              <v-chip-group active-class="yellow lighten-5" column>
                <v-chip class="schedule-chips" color="yellow">
                  {{ films[i] && films[i].seances[0].time }}
                  <span
                    class="formats"
                  >{{ films[i] && films[i].seances[0].formats[0].title }}</span>
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </div>
        </v-card>
      </v-col>

      <v-divider class="mx-4" v-if="i !== films.length - 1"></v-divider>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    films() {
      return this.$store.getters["films/films"];
    }
  }
};
</script>

<style scoped>
.comma:not(:last-child):after {
  content: ", ";
}
.films__img {
  position: relative;
  margin: 30px 0;
}
.films__info {
  padding: 0 40px;
  width: 400px;
}
.films__schedule {
  padding: 0 40px;
  width: 400px;
}
.schedule-chips {
  position: relative;
}
.formats {
  display: block;
  position: absolute;
  top: 40px;
  right: 19px;
}
.triangle-trailer {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-left: 100px solid rgb(255, 235, 59);
  border-bottom: 50px solid transparent;
}
</style>
