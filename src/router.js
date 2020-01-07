import Vue from 'vue'
import Router from 'vue-router'
import WalkAboutItSites from './views/walkaboutit/WalkAboutItSites.vue'
import MapWalkAboutIt from './components/MapWalkAboutIt.vue'
import MapMegaregion from './components/MapMegaregion.vue'
import MapBioregion from './components/MapBioregion.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/walkaboutit/sites'
    },
    {
      path: '/walkaboutit/sites',
      name: 'WalkAboutItSites',
      components: {
        default: WalkAboutItSites,
        map: MapWalkAboutIt
      }
    },
    {
      path: '/megaregion/introduction',
      name: 'megaregionIntroduction',
      components: {
        default: () => import('./views/megaregion/MegaregionIntroduction.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/bioregion/introduction',
      name: 'bioregion',
      components: {
        default: () => import('./views/bioregion/BioregionIntroduction.vue'),
        map: MapBioregion
      }
    }
  ]
})
