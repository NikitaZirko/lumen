export const state = () => ({
  filters: [],
  films: []
})

export const mutations = {
  setFilters(state, filters) {
    state.filters = filters
  },
  setFilms(state, films) {
    state.films = films
  }
}

export const actions = {
  async filterFilms({ commit }) {
    const filters = await this.$axios.$get('https://admin.lmndev.ml/api/public/films/filters')
    commit('setFilters', filters)
  },

  async allFilms({ commit }, qParam) {
    const films = await this.$axios.$get(`https://admin.lmndev.ml/api/public/films?${qParam.age_rating}${qParam.genre}${qParam.from_date}${qParam.to_date}`).catch(() => {
      console.log("error")
    });
    commit('setFilms', films)
  }
}

export const getters = {
  filters: st => st.filters,
  filterAgeRatings: function (st, gt) {
    if(typeof gt.filters.age_ratings !== "undefined") {
      return gt.filters.age_ratings.slice().sort(function (a, b) {
        return parseInt(a) - parseInt(b)
      })
    } else {return []}
  },
  convertTimestamp: function (st, gt) {
    let dt = [];
    if(typeof gt.filters.dates !== "undefined") {
      for (let i = 0; i < gt.filters.dates.length; i++) {
        let date = new Date(gt.filters.dates[i]*1000);
        let day = date.getDate();
        dt.push(day);
      }
      return dt
    } else {return []}
  },
  limit: function (st, gt) {
    let dt = [];
    function dateConvert(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (String(month).length == 1) {
        month = "0" + month;
      }
      if (String(day).length == 1) {
        day = "0" + day;
      }
      dt.push(year + "-" + month + "-" + day);
    }
    if(typeof gt.filters.dates !== "undefined") {
        dateConvert(new Date(gt.filters.dates[0]*1000));
        dateConvert(new Date(gt.filters.dates[gt.filters.dates.length - 1]*1000));
    } else {return []}
    return dt
  },
  films: st => st.films
}
