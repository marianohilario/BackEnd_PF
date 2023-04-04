const ioServer = io()

let nombre = document.querySelector('#user')
let texto = document.querySelector('#mensaje')

let submitMsg = document.querySelector('#submitMsg')

let chatContainer = document.querySelector('#chatContainer')

submitMsg.addEventListener('click', (event)=>{
    event.preventDefault()

    let msg = {
        user: nombre.value,
        message: texto.value
    }
    console.log(msg);

    ioServer.emit('msg', msg)
})

ioServer.on('Mensaje', data =>{
    chatContainer.innerHTML = ''

    data.forEach(element => {
        chatContainer.innerHTML += `<div>
                                        <p><strong> User: ${element.user}</strong>  -   Msg: ${element.message}</p>
                                    </div>
                                   `
    })
})