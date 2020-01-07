<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ} from 'ol/source'
import {fromLonLat} from 'ol/proj'

import {easeOut} from 'ol/easing.js'
import {Style, Icon, Text, Fill, Stroke} from 'ol/style'
import {unByKey} from 'ol/Observable.js'

import {eventBus} from '../main'
import VideoLightBox from './VideoLightBox.vue'
import MediaLightBox from './MediaLightBox.js'

export default {
  name: 'MapWaWalkAboutIt',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        sites: {
          center: [-87.6, 41.85],
          resolution: 140
        }
      }
    }
  },
  computed: {
    sitesLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://deeptimechicago.org/Walkaboutit/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONPointVectorLayer('geojson/Walks.geojson', 'icons/Marker.png', null, 4, 1000)
      ]
    }
  },
  components: {
    VideoLightBox
  },
  created: function () {
    eventBus.$on('route-click', this.initMap)
  },
  beforeDestroy: function () {
    eventBus.$off('route-click', this.initMap)
  },
  mounted: function () {
    this.initMap()
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'walkaboutitSites':
          this.initwalkaboutitSites()
          break
        default:
          this.initWalkAboutItSites()
      }
      this.olmap.on('pointermove', (e) => {
        const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
        if (feature) {
          const props = feature.getProperties()
          if (props.key) {
            this.$refs.titletipContent.innerHTML = props.key
            this.titletip.setPosition(e.coordinate)
          }
        } else {
          this.closeTitletip()
          this.closeTooltip()
        }
      })
    },
    initWalkAboutItSites: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.sitesLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.sites.center),
        resolution: this.centerPoints.sites.resolution,
        minResolution: 0.25,
        maxResolution: 32000
      }))
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc) {
              const mediabox = new MediaLightBox(props.vimeoSrc)
              mediabox.open()
            }
          }
        })
      }
    },
    flash: function (feature) {
      const featureName = feature.values_['key2'] || ''
      const featureDate = feature.values_['date'] || ''
      const iconSrc = feature.values_['icon'] || ''
      const start = new Date().getTime()
      const listenerKey = this.olmap.on('postcompose', (event) => {
        const duration = 2500
        const elapsed = event.frameState.time - start
        const elapsedRatio = elapsed / duration
        const opacity = easeOut(1 - elapsedRatio)
        feature.setStyle([
          new Style({
            text: new Text({
              text: featureName,
              fill: new Fill({color: [255, 255, 255, opacity]}),
              stroke: new Stroke({color: [0, 0, 0, opacity]}),
              backgroundFill: new Stroke({color: [0, 0, 0, opacity / 6]}),
              scale: 1.9,
              offsetY: -7
            })
          }),
          new Style({
            text: new Text({
              text: featureDate,
              fill: new Fill({color: [255, 255, 255, opacity]}),
              stroke: new Stroke({color: [0, 0, 0, opacity]}),
              backgroundFill: new Stroke({color: [0, 0, 0, opacity / 3]}),
              scale: 2,
              offsetY: 20
            })
          }),
          new Style({
            image: new Icon({
              src: iconSrc,
              opacity: 1
            })
          })
        ])
        if (elapsed > duration) {
          unByKey(listenerKey)
          return
        }
        // tell OpenLayers to continue postcompose animation
        this.olmap.render()
      })
      this.listenerKeys.push(listenerKey)
    }
  }
}
</script>
