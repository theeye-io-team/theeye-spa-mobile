//import jquery from 'jquery'
import bootbox from 'bootbox'
import App from 'ampersand-app'
import config from 'config'
import XHR from 'lib/xhr'
const xhr = $.ajax

module.exports = {
  create (data) {
    App.state.loader.visible = true

    var body = {}
    body.sendInvitation = !data.enabled
    body.email = data.email
    body.username = data.username
    if (data.enabled) { // create enable, need password
      body.password = data.password
      body.confirmPassword = data.confirmPassword
    }
    body.credential = data.credential
    body.customers = data.customers.map(id => {
      return App.state.customers.get(id).name
    })

    const req = xhr({
      url: '/user',
      type: 'POST',
      data: JSON.stringify(body),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    })

    req.done(function(){
      bootbox.alert({
        title: 'User created',
        message: `You have successfully created ${body.username}`,
        callback: () => {
          App.state.loader.visible = false
          App.Router.reload()
        }
      })
    })
    req.fail(function(jqXHR, textStatus, errorThrown){
      bootbox.alert({
        title: 'User creation error - ' + errorThrown,
        message: jqXHR.responseText,
        callback: () => {
          App.state.loader.visible = false
          App.Router.reload()
        }
      })
    })
  },
  update (id, data) {
    var body = {}
    body.email = data.email
    body.username = data.username
    body.credential = data.credential
    body.customers = data.customers.map(id => {
      return App.state.customers.get(id).name
    })

    App.state.loader.visible = true
    const req = xhr({
      url: `/user/${id}`,
      type: 'PUT',
      data: JSON.stringify(body),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
    })

    req.done(function(){
      bootbox.alert({
        title: 'User created',
        message: `You have successfully updated ${body.username}`,
        callback: () => {
          App.Router.reload()
          App.state.loader.visible = false
        }
      })
    })

    req.fail(function(jqXHR, textStatus, errorThrown){
      bootbox.alert({
        title: `User update error - ${errorThrown}`,
        message: jqXHR.responseText,
        callback: () => {
          App.Router.reload()
          App.state.loader.visible = false
        }
      })
    })
  },
  remove (id) {
    const req = xhr({
      url: `/user/${id}`,
      type: 'DELETE'
    })

    req.done((data, textStatus, jqXHR) => {
      bootbox.alert({
        title: 'User Removed',
        message: `user has been removed.`,
        callback: () => {
          window.location.reload()
        }
      })
    })

    req.fail((jqXHR, textStatus, errorThrown) => {
      const errorMessage = jqXHR.responseText || textStatus
      bootbox.alert({
        title: 'User Remove error',
        message: errorMessage
      })
    })
  },
  registerDeviceToken (id, data) {
    XHR.send({
      url: `${config.app_url}/user/${id}/registerdevicetoken`,
      method: 'post',
      jsonData: data,
      timeout: 5000,
      withCredentials: true,
      headers: {
        Accept: 'application/json;charset=UTF-8'
      },
      done: (response,xhr) => {
        if (xhr.status == 200){
          console.log('User register for notifications service successfull.')
        } else {
          bootbox.alert('Error registering user for notifications service.')
        }
      },
      fail: (err,xhr) => {
        bootbox.alert('Error registering user for notifications service.')
      }
    })
  }
}
