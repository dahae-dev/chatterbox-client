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
    $.ajax({
      url: this.server,
      success: data => this.renderMessage(data[data.length - 1])
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
      username: $('#username').val(),
      text: $('#text').val(),
      roomname: $('#roomSelect').find(':selected').val()
    }

    app.send(message)
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

// setInterval(app.fetch, 2000);
// setInterval(function(){
//   location.reload();
// }, 5000);

/* 입력한 데이터 렌더링한 다음에 입력값 삭제
$('#username').val('');
$('#text').val('');
$('#roomname').val('');
*/
/*
$(document).ready(() => {
  const url = 'http://52.78.213.9:3000/messages';

  const fetchMessages = () => $.ajax({
    url,
    success: (data) => {
      $('#chats').html('');
      data.forEach(({username, text, roomname, date}) => {
        const $p = $(`<p>${username}: ${text} (${roomname} @${date})</p>`);
        $('#chats').append($p);
      })
    }
  });

  const postMessage = () => $.ajax({
    type: 'POST',
    url,
    contentType: 'application/json',
    data: JSON.stringify({
      username: $('#username').val(),
      text: $('#text').val(),
      roomname: $('#roomname').val()
    }),
    success: () => fetchMessages()
  });

  //fetchMessages();

  $(document).on('click', '#fetch-btn', fetchMessages);
  $(document).on('click', '#post-message', postMessage);
})
*/
