<svelte:options customElement="lobby-component" />

<script>
    export const name = new URL(window.location.href).searchParams.get('name') ?? "Gustavo"
    let players = $state({ players: [] })
    let location = $state("praia")

    function updateLocation(event) {
        location = event.target.value
    }

    async function atualizar() {
        let response = await fetch('api/lobby/getPlayers', { method: 'GET' })
        if (!response.ok) {
            alert('Error getting players')
            return
        }
        players = await response.json()
    }

    async function startGame() {
        console.log(name, location)
        const response = await fetch('api/lobby/startGame', {
            method: 'POST',
            body: JSON.stringify({ host: name, location: location }),
        })

        alert(await response.text())
    }

    async function getLocation() {
        const response = await fetch(`api/lobby/getLocation?name=${name}`, {
            method: 'GET',
        })
        if (response.ok) {
            const data = await response.json()
            alert(data.location)
            return
        }
        alert(await response.text())
    }
</script>

<div class="component-wrapper">
    <div class="app-bar">
        <h2>Olá {name}</h2>
    </div>
    <div class="container-vertical">
        <div class="container-horizontal">
            <button class="default-button width-50" onclick={atualizar}> Atualizar </button>
            <button class="default-button width-50" onclick={getLocation}> Comecou? </button>
        </div>
        <ol class="ol-players">
            {#if players.players.length > 0}
                {#each players.players as player}
                    <li class="li-players">{player.name}</li>
                {/each}
            {/if}
        </ol>
        <div class="container-horizontal">
            <input type="text" class="default-input thin" onchange={updateLocation} value="praia"/>
            <button class="default-button thin" onclick={startGame}>Start</button>
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
