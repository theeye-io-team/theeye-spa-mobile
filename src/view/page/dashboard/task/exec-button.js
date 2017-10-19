import bootbox from 'bootbox'
import JobActions from 'actions/job'
import View from 'ampersand-view'
import ladda from 'ladda'
const logger = require('lib/logger')('page:dashboard:task:exec-button')
import LIFECYCLE from 'constants/lifecycle'
import AnalyticsActions from 'actions/analytics'

import './styles.less'

module.exports = View.extend({
  template: `
    <li class="task-exec-button">
      <button data-hook="trigger"
        class="ladda-button btn btn-primary tooltiped"
        title="Run this task"
        data-spinner-size="30"
        data-style="zoom-in">
        <i class="fa fa-play" aria-hidden="true"></i>
      </button>
    </li>
  `,
  events: {
    'click button[data-hook=trigger]':'onClickTrigger',
  },
  onClickTrigger (event) {
    event.stopPropagation()
    event.preventDefault()

    if (!this.model.canExecute) return

    if (this.model.lastjob.inProgress()) {
      const message = `Cancel task <b>${this.model.name}</b> execution?
              <a target="_blank" href="https://github.com/theeye-io/theeye-docs/blob/master/tasks/cancellation">Why this happens?</a>`
      bootbox.confirm({
        message: message,
        backdrop: true,
        callback: (confirmed) => {
          if (confirmed) {
            JobActions.cancel(this.model)
          }
        }
      })
    } else {
      const message = `You are about to run the task <b>${this.model.name}</b>. Are you sure?`
      bootbox.confirm({
        message: message,
        backdrop: true,
        callback: (confirmed) => {
          if (confirmed) {
            JobActions.create(this.model)

            AnalyticsActions.trackEvent('Task', 'Execution', this.model.id)
            AnalyticsActions.answersTrackEvent('Task execution', {id: this.model.id})
          }
        }
      })
    }

    return false
  },
  initialize () {
    View.prototype.initialize.apply(this,arguments)
  },
  render () {
    this.renderWithTemplate()

    this.lbutton = ladda.create( this.queryByHook('trigger') )

    this.listenToAndRun(this.model.lastjob,'change:lifecycle',() => {
      this.checkJobLifecycle()
    })
  },
  //props: {
  //  disabled: ['boolean',false,false]
  //},
  //bindings: {
  //  disabled: {
  //    hook: 'trigger',
  //    type: 'booleanAttribute',
  //    name: 'disabled'
  //  }
  //},
  checkJobLifecycle () {
    const lifecycle = this.model.lastjob.lifecycle
    switch (lifecycle) {
      case LIFECYCLE.FINISHED:
      case LIFECYCLE.TERMINATED:
      case LIFECYCLE.COMPLETED:
      case LIFECYCLE.EXPIRED:
      case LIFECYCLE.CANCELED:
        this.lbutton.stop()
        break;
      case LIFECYCLE.READY:
      case LIFECYCLE.ASSIGNED:
        this.lbutton.start()
        this.queryByHook('trigger').removeAttribute('disabled')
        break;
      default:
        logger.error('no lifecycle')
        break;
    }
  }
})
