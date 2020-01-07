import Vue from 'vue'
import Router from 'vue-router'
import WatershedAcknowledgement from './views/watershed/WatershedAcknowledgement.vue'
import MapWatershed from './components/MapWatershed.vue'
import MapMegaregion from './components/MapMegaregion.vue'
import MapBioregion from './components/MapBioregion.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/watershed/acknowledgement'
    },
    {
      path: '/watershed/acknowledgement',
      name: 'watershedAcknowledgement',
      components: {
        default: WatershedAcknowledgement,
        map: MapWatershed
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
