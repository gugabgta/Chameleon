<svelte:options customElement="lobby-component" />

<script>
    export const name = new URL(window.location.href).searchParams.get('name')
    let players = $state({ players: [] })

    async function atualizar() {
        // players = await fetch('api/getPlayers', { method: 'GET' })
        players = { players: [{ name: 'Player 1' }, { name: 'Player 2' }, { name: 'Player 3' }] }
    }
</script>

<div class="component-wrapper">
    <div class="app-bar">
        <h2>Lobby</h2>
    </div>
    <div class="container-vertical">
        <button class="default-button" onclick={atualizar}> Atualizar </button>
        <ol class="list-players">
            {#each players.players as player}
                <li class="li-players">{player.name}</li>
            {/each}
        </ol>
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
    }

    .app-bar h2 {
        font-family: 'Roboto', sans-serif;
        font-size: 36px;
        color: white;
    }

    .container-vertical {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 80vh;
    }

    .default-button {
        width: 50%;
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
</style>
