let socket = io();
socket.on('message', addMessages);
socket.on('delMsg', removeMessage);
socket.on('updMsg', changeMessage);

$(() => {
  $("#send").click(() => {
    let params = {
      name: $("#name").val().trim(),
      message: $("#message").val().trim()
    };
    $('[data-update-id]').length ? (params.id = $('[data-update-id]').data('updateId').trim(),updateMessage(params)) : sendMessage(params);
    $("#message").val('').focus();
    $("#name").addClass('no-empty');

  });
  $('#emoji-menu button').click((emoji)=> $('#message').val($('#message').val()+' '+$(emoji.currentTarget).text()));
  getMessages();
});

sendMessage = (message) => $.post('http://localhost:3000/messages', message);

$(document).keyup((e)=> {
   if (e.key === 'Enter')
     $("#send").length ? $("#send").click() : $("#update").click();
   
});

let listOfDays = [];
function displayDate(day){
  listOfDays == [] ? listOfDays.push(day) : '';
  listOfDays.includes(day) ? day = false : listOfDays.push(day)
  return day;
}

function getMessages(){
  $.get('http://localhost:3000/messages', (data) => data.forEach(addMessages));
};

function addMessages(message) {
  dateToDisplay = displayDate(message.day)
  if (dateToDisplay){
    $("#messages").append(`
      <div class=" day position-relative mb-4">
        <div class="position-absolute w-100 d-flex justify-content-center">
          <span class="bg-white px-5 font-weight-bold">
            ${dateToDisplay}
          </span>
        </div>
        <hr class="position-absolute w-100">
      </div>
    `);
  };

  $("#messages").append(`
      <div class="p-md-1" data-msg-id='${message._id}'>
      <div class="row">

        <div class="col-sm-10">
          <h4 class="bold mb-0"><span data-msg-author>${message.name}</span><span class="text-secondary small">${message.createdAt}</span></h4>
          <p class="m-0 mb-sm-4 mb-md-3" data-msg-content>${message.message}</p>
        </div>

        <div class="col-sm-2 d-flex justify-content-end">
          <div class="d-flex">
            <button aria-label="Editer" class="border-0 bg-transparent" onclick="editMessage('${message._id}')"><i class="far fa-edit"></i></button>
            <button aria-label="Supprimer" class="border-0 bg-transparent" onclick="deleteMessage('${message._id}')"><i class="far fa-trash-alt"></i></button>
          </div>
        </div>

      </div>
    </div>
  `);
  var element = $("#messages > div").last()[0];
  $(element).last().hide().show('fast', ()=> element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}));
};

deleteMessage = (delMsg) => $.get(`http://localhost:3000/message/${delMsg}/delete`).done(removeMessage(delMsg));

function removeMessage(delMsg){
  $(`div[data-msg-id=${delMsg}]`).hide('slow', ()=> $(this).remove());
};

editMessage = (msgId) => {
  $("#name").val($(`div[data-msg-id=${msgId}] [data-msg-author]`).text().trim());
  $("#message").val($(`div[data-msg-id=${msgId}] [data-msg-content]`).text().trim()).focus();
  $('[data-action-btn]').attr('id','update').attr('data-update-id',msgId);
  $('[data-action-btn] .send-text').text('Modifier');
  $('[data-action-btn]').data('updateId', msgId)
};

updateMessage = (updMsg)=> {
  $.post(`http://localhost:3000/message/${updMsg.id}`,updMsg).done(
      $('[data-action-btn]').attr('id','send').removeAttr('data-update-id'),
      $('[data-action-btn] .send-text').text('Envoyer'),
    );
}

function changeMessage(updMsg){
  $(`[data-msg-id='${updMsg.id}'] [data-msg-author]`).text(updMsg.name);
  $(`[data-msg-id='${updMsg.id}'] [data-msg-content]`).text(updMsg.message);
};