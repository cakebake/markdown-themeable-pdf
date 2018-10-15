'use babel'

import { get } from 'lodash'
import { PACKAGE_NAME } from '../config'
import { isPackageLoaded } from '../api/atom'

const notification = (detail, type = 'info', options = {}) => {
  if (isPackageLoaded('notifications')) {
    let model
    switch (type) {
      case 'error':
        model = atom.notifications.addError(PACKAGE_NAME, { ...options, detail, dismissable: true, icon: 'markdown' })
        break
      case 'warning':
        model = atom.notifications.addWarning(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
        break
      case 'success':
        model = atom.notifications.addSuccess(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
        break
      default:
        model = atom.notifications.addInfo(PACKAGE_NAME, { ...options, detail, icon: 'markdown' })
    }
    return model
  } else {
    if (!get(options, 'buttons.buttons')) {
      window.alert(`${PACKAGE_NAME}: ${detail}`)
      let dismissAction = () => {}
      return {
        dismiss () {
          dismissAction()
        },
        onDidDismiss (action) {
          dismissAction = action
        }
      }
    } else {
      console.error('Notification package disabled')
    }
  }
}

export default notification
