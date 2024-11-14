<svelte:options customElement="lobby-component" />

<script>
// @ts-nocheck

    export const name = new URL(window.location.href).searchParams.get('name') ?? ""
    export const id = new URL(window.location.href).searchParams.get('id') ?? "0"

    let players = $state({ players: [] })
    let location = $state("praia")
    let current_location = $state("")
    let game_started = $state(false)
    let web_socket = null
    let is_host = false

    async function onLoad() {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        web_socket = new WebSocket(
            `${protocol}://${window.location.host}/api/lobby/webSocket?id=${id}`
        )

        if (!web_socket) {
            console.log(`tried connection to ws://${window.location.host}/api/lobby/webSocket?id=${id}`)
            alert('Error connecting to server')
            return
        }

        web_socket.onmessage = async (event) => {
            const [channel, message] = channelMessage(event)
            if (channel === 'new_player') {
                updatePlayers()
                return
            }

            if (channel === 'player_left') {
                updatePlayers()
                return
            }

            if (channel === 'game_started') {
                if (message === 'true') {
                    getLocation()
                    game_started = true
                }
                return
            }

            if (channel === 'game_ended') {
                game_started = false
                return
            }

            console.log(`Unknown channel ${channel}`)
        }

        web_socket.onclose = () => {
            console.log('Connection closed')
        }
        updatePlayers()
    }

    function channelMessage(event) {
        const message = event.data.split(':')
        return [message[0], message[1]]
    }

    function updateLocation(event) {
        const target = event.target;
        if (target) {
            location = target.value;
        }
    }

    async function updatePlayers() {
        let response = await fetch('api/lobby/getPlayers', { method: 'GET' })
        if (!response.ok) {
            alert('Error getting players')
            return
        }
        players = await response.json()
    }

    async function startGame() {
        const response = await fetch('api/lobby/startGame', {
            method: 'POST',
            body: JSON.stringify({ host: id, location: location }),
        })

        if (response.ok) {
            is_host = true
            return
        }
    }

    async function endGame() {
        const response = await fetch('api/lobby/endGame', {
            method: 'POST',
            body: JSON.stringify({ host: id }),
        })

        if (response.ok) {
            is_host = false
            game_started = false
            return
        }
    }

    async function getLocation() {
        const response = await fetch(`api/lobby/getLocation?id=${id}`, {
            method: 'GET',
        })

        if (response.ok) {
            const data = await response.json()
            current_location = data.location
            return
        }

        alert('Error getting location')
    }

    async function debugCheats() {
        const response = await fetch('api/lobby', {
            method: 'GET',
        })

        alert(await response.text())
    }

    async function leave() {
        web_socket.close()
        const response = await fetch(`api/lobby/leave?id=${id}`, {
            method: 'GET',
        })

        window.location.href = '/'
    }

    onLoad()
</script>

<div class="component-wrapper">
    <div class="app-bar">
        <h2>Olá {name}</h2>
    </div>
    <div class="container-vertical">
        <div class="container-horizontal">
            <div class="default-button width-50"> Lobby </div>
        </div>
        <ol class="ol-players">
            {#if players.players.length > 0}
                {#each players.players as player}
                    <li class="li-players">{player.name}</li>
                {/each}
            {/if}
        </ol>
        <div class="container-horizontal">
            {#if !game_started}
                <input type="text" class="default-input thin" onchange={updateLocation} value="praia"/>
                <button class="default-button thin" onclick={startGame}>Start</button>
            {:else if game_started}
                <h2>{ current_location }</h2>
            {/if}
        </div>
        <div class="container-horizontal">
            <button class="default-button thin" onclick={leave}> Leave </button>
            {#if game_started}
                <button class="default-button thin" onclick={endGame}> End </button>
            {/if}
        </div>
    </div>
</div>


<style>
    .component-wrapper {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow-y: hidden;
        overflow-x: hidden;
    }

    .app-bar {
        display: flex;
        justify-content: left;
        align-items: center;
        background-color: #ff8000;
        height: 20vh;
        width: 100%;
        padding: 14px;
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
        margin-bottom: 5vh;
    }

    .app-bar h2 {
        font-family: 'Roboto', sans-serif;
        font-size: 36px;
        color: white;
    }

    .container-vertical {
        display: flex;
        flex-direction: column;
        justify-content: top;
        align-items: center;
        height: 80vh;
    }

    .container-horizontal {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 80%;
    }

    .width-50 {
        width: 50%;
    }

    .default-button {
        background-color: #ffa500;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 8px;
        padding: 10px 24px;
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    .default-input {
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 2px solid #ffa500;
        border-radius: 8px;
        color: #ffa500;
        font-size: large;
        text-align: center;
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
        max-width: 60%;
    }

    .ol-players {
        list-style-type: none;
        padding: 0;
        margin: 0;
        width: 50%;
    }

    .li-players {
        background-color: #3c3b3aa0;
        color: white;
        margin: 4px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
    }
</style>
