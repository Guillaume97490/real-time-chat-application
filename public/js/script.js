var socket = io();
$(() => {
    $("#send").click(() => {
      if ($('[data-update-id]').length){
          id = $('[data-update-id]').data('updateId')
          console.log(id)
          updateMessage({
            id: id,
            name: $("#name").val().trim(),
            message: $("#message").val().trim()
          });
      }else{
          sendMessage({
            name: $("#name").val().trim(),
            message: $("#message").val().trim()
          });
      }
      $("#name").val('')
      $("#message").val('')
    })
    getMessages()
})
socket.on('message', addMessages);
socket.on('delMsg', removeMessage);
socket.on('updMsg', changeMessage);

function addMessages(message) {
    // console.log(message);
    $("#messages").append(`
  <div class="p-md-1" data-msg-id='${message._id}'>
    <hr class="my-1">
    <div class="row">

      <div class="col-10">
        <h4 class="m-0 mb-md-2" data-msg-author> ${message.name} </h4>
        <p class="m-0 mb-md-2" data-msg-content>  ${message.message} </p>
      </div>

      <div class="col-2">
        <div>
          <button class="border-0 bg-transparent" onclick="editMessage('${message._id}')"><i class="far fa-edit"></i></button>
          <button class="border-0 bg-transparent" onclick="deleteMessage('${message._id}')"><i class="far fa-trash-alt"></i></button>
        </div>
      </div>

    </div>
  </div>
`)
var element = $("#messages > div:last-of-type")[0];
console.log(element)
element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
};

deleteMessage = (delMsg) => $.get(`http://localhost:3000/message/${delMsg}/delete`).done(removeMessage(delMsg));

function removeMessage(delMsg){
    $(`div[data-msg-id=${delMsg}]`).remove();
};

function getMessages(){
    $.get('http://localhost:3000/messages', (data) => data.forEach(addMessages));
};
    
sendMessage = (message) => $.post('http://localhost:3000/messages', message);

editMessage = (msgId) => {
    console.log(msgId)
    $("#name").val($(`div[data-msg-id=${msgId}] [data-msg-author]`).text().trim());
    $("#message").val($(`div[data-msg-id=${msgId}] [data-msg-content]`).text().trim());
    // $('[data-action-btn]').removeAttr('data-update-id');
    $('[data-action-btn]').attr('id','update').attr('data-update-id',msgId).text('Modifier');
    $('[data-action-btn]').data('updateId', msgId)

    id = $('[data-action-btn]').data('updateId')
          console.log(id)
};

updateMessage = (updMsg)=> $.post(`http://localhost:3000/message/${updMsg.id}`,updMsg).done($('[data-action-btn]').attr('id','send').removeAttr('data-update-id').text('Envoyer'))

function changeMessage(updMsg){
    console.log(updMsg);
    $(`[data-msg-id='${updMsg.id}'] [data-msg-author]`).text(updMsg.name)
    $(`[data-msg-id='${updMsg.id}'] [data-msg-content]`).text(updMsg.message)
};
      