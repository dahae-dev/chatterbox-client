// YOUR CODE HERE:
var app = {
  server: 'http://52.78.213.9:3000/messages',

  init: function () {
    this.renderAllMessage()
    this.fetchRoom()
    $(document).on('click', '#send', this.handleSubmit)
  },

  send: function (message) {
    $.ajax({
      type: 'POST',
      url: this.server,
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: () => this.fetch()
    })
  },

  fetch: function () {
    var oldData = $('#chats').children().length
    $.ajax({
      url: this.server,
      success: data => {
        var recentData = data[data.length - 1]
        if(oldData !== data.length) {
          this.renderMessage(recentData)
        }
      }
    })
  },

  clearMessages: function () {
    $('#chats').empty()
  },

  renderAllMessage: function () {
    $.ajax({
      url: this.server,
      success: data => {
        $('#chats').html('')
        data.forEach(({ username, text, roomname, date }) => {
          var username = this.escapeHTML(username)
          var text = this.escapeHTML(text)
          var roomname = this.escapeHTML(roomname)
          const $p = $(
            `<p><a>${username}</a>: ${text} (${roomname} @${date})</p>`
          )
          $('#chats').prepend($p)
        })
      }
    })
  },

  renderMessage: function (message) {
    var username = this.escapeHTML(message.username)
    var text = this.escapeHTML(message.text)
    var roomname = this.escapeHTML(message.roomname)
    var date = new Date()
    const $p = $(`<p><a>${username}</a>: ${text} (${roomname} @${date})</p>`)
    $('#chats').prepend($p)
  },

  fetchRoom: function () {
    $.ajax({
      url: this.server,
      success: data => {
        var rooms = []
        data.forEach(({ username, text, roomname, date }) => {
          if (!rooms.includes(roomname)) {
            rooms.push(roomname)
          }
        })
        rooms.forEach(room => {
          this.renderRoom(room)
        })
      }
    })
  },

  renderRoom: function (roomname) {
    var $room = $(`<option>${roomname}</option>`)
    $('#roomSelect').append($room)
  },

  handleSubmit: function () {
    var message = {
      username: $('#username').text(),
      text: $('#text').val(),
      roomname: $('#roomSelect').find(':selected').val()
    }

    if(message.text === '') {
      alert('Please fill text in!');
    }

    app.send(message)
    $('#text').val('')
  },

  escapeHTML: function (str) {
    if (str && typeof str === 'string') {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }
  }
}

app.init()

// *** automatic refresh : needs to be fixed to refresh new messages by each room ***
var intervalIndex = setInterval(function () {
  app.fetch()
}, 1000)

// show welcome message
$('#loginBtn').on('click', function () {
  var username = $('#loginname').val()
  if (username === '') {
    alert('Please fill username in!')
  } else {
    $('#username').text(username)
    $('#state').removeClass('hide')
    $('#login').addClass('hide')
  }
})

// change username
$('#logoutBtn').on('click', function () {
  location.reload()
})

// select a room
$('#roomSelect').on('change', function () {
  clearInterval(intervalIndex);
  // add auto refresh by each room

  var selectedRoom = $('#roomSelect').find(':selected').val()
  if (selectedRoom === 'add a new room') {
    $('#add').removeClass('hide')
  } else if(selectedRoom === 'select a room') {
    return;
  } else {
    $.ajax({
      url: app.server,
      success: data => {
        $('#chats').html('')
        data.forEach(({ username, text, roomname, date }) => {
          if(roomname === selectedRoom) {
            var username = app.escapeHTML(username)
            var text = app.escapeHTML(text)
            var roomname = app.escapeHTML(roomname)
            const $p = $(
              `<p><a>${username}</a>: ${text} (${roomname} @${date})</p>`
            )
            $('#chats').prepend($p)
          }
        })
      }
    })
  }
})

// add a new room and select it
$('#addBtn').on('click', function () {
  var roomname = $('#roomname').val()
  app.renderRoom(roomname)
  $('#roomname').val('')
  $('#add').addClass('hide')
  var options = $('#roomSelect').children()
  options[options.length - 1].setAttribute('selected', 'selected')
})

// see all the Messages
$('#allBtn').on('click', function () {
  app.renderAllMessage();
})

// clear all the Messages
$('#clearBtn').on('click', function () {
  app.clearMessages();
})