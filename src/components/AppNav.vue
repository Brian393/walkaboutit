<template>
  <div v-if="!asideHidden">
    <div id="items" v-if="nav.items">
      <router-link v-for="item in nav.items" :key="item.name" :to="item.href" @click.native="routeClick(item.href)" class="btn">{{item.name}}</router-link>
    </div>

    <div id="subItems" v-if="navSubItems">
      <router-link v-for="subItem in navSubItems" :key="subItem.name" :to="subItem.href" @click.native="routeClick(subItem.href)" class="btn subItem">{{subItem.name}}</router-link>
    </div>
  </div>
</template>
<style scoped>
#items, #subItems {
  position: absolute;
  z-index: 1;
  border-radius: 6px;
  background-color: rgba(255,255,255, 0.9);
  display: flex;
  font-size: 1.15em;
}

#items {
  bottom: 2.5em;
  left: 2.5em;
  flex-direction: column;
  width: 150px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
}

#subItems {
  font-size: 1em;
  left: calc(150px + 0.5em);
  width: 100%;
  min-width: calc(100px - 0.2em);
  max-width: calc(100vw - 400px - 150px);
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  background-color: transparent;
  height: 0;
  bottom: 50px;
}

.btn {
  padding: 0.25em;
  text-align: center;
  border: thin solid darkgray;
  border-radius: 6px;
  margin: 0.1em;
  background-color: rgba(255,255,255, 0.95);
  color: black;
  text-decoration: none;
}

.btn:hover, .router-link-active {
  color: #008000;
}

.subItem {
  min-width: 100px;
  height: 1.25em;
}
@media (max-width: 1075px) {
  #items, #subItems {
    font-size: 1em;
  }
  .subItem {
    width: auto;
  }
}
@media (max-width: 850px) {
  #items, #subItems {
    position: static;
    font-size: 1.5em;
  }
  #items, .subItem {
    width: 100%;
  }
  #subItems {
    margin-top: 1em;
    min-width: 100%;
    max-width: 100%;
  }
}
</style>
<script>
import {mapGetters} from 'vuex'
import {eventBus} from '../main'

export default {
  name: 'AppNav',
  data: function () {
    return {
      nav: [],
      navSubItems: [],
      walkaboutit: {
        items: [
          {
            name: 'Walks 2020',
            href: '/walkaboutit/2020'
          },
          {
            name: 'Previous events',
            href: '/walkaboutit/previous'
          }
        ]
      }
    }
  },
  computed: {
    // mix the getters from vuex store into computed with object spread operator
    ...mapGetters([
      'asideHidden'
    ])
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.initNav()
    }
  },
  mounted: function () {
    this.initNav()
  },
  methods: {
    initNav: function () {
      if (/walkaboutit/.test(this.$route.name)) {
        this.nav = this.walkaboutit
      } else {
        this.nav = []
      }
      if (/walkaboutitPrevious/.test(this.$route.name)) {
        this.navSubItems = this.subItems.previous
      } else {
        this.navSubItems = []
      }
    },
    routeClick: function (to) {
      if (to === this.$route.path) {
        eventBus.$emit('route-click')
      }
    }
  }
}
</script>
