'use strict'

import JsonViewer from 'components/json-viewer'
import Modalizer from 'components/modalizer'
import AnalyticsActions from 'actions/analytics'

//import CommandOutputViewer from 'components/command-output-viewer'

/**
 *
 * @summary modal to display jobs output
 *
 */
module.exports = Modalizer.extend({
  props: {
    output: 'any'
  },
  initialize (options) {
    Modalizer.prototype.initialize.apply(this, arguments)

    this.backdrop = false
    this.title = 'Execution Output'

    //if (this.model.type !== 'script') {
      this.bodyView = new JsonViewer({
        json: this.output
      })
    //} else {
    //}

    this.listenTo(this,'hidden',() => {
      AnalyticsActions.trackView('dashboard')
      this.bodyView.remove()
      delete this.bodyView
    })

    this.listenTo(this, 'change:output', () => {
      if (!this.output) return
      this.bodyView.json = this.output
      this.bodyView.render()
    })
  }
})
