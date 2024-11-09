<svelte:options customElement="menu-component" />

<!-- workaround to avoid class not existing -->
{#if false}
    <div class="shake" ></div>
{/if}

<script lang="ts">
    let name = $state("Gustavo")
    let input: HTMLInputElement | null = null

    function changeName(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            name = target.value;
        }
    }

    async function click() {
        if (name.length < 2 && input) {
            input.classList.toggle('shake')
            setTimeout(() => input?.classList.toggle('shake'), 390)
            return
        }

        const response = await fetch('api/lobby/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        })

        if (!response.ok) {
            alert('Error joining server')
            return
        }
        const player = await response.json()
        window.location.href = `/lobby?id=${player.id}&name=${player.name}`
        return
    }
</script>

<div class="component-wrapper">
    <div class="app-bar">
        <h2>Camaleão</h2>
    </div>
    <div class="container-vertical">
        <input
            bind:this={input}
            id="input"
            class="default-input"
            oninput={changeName}
            type="text"  name="name"  maxlength="20" minlength="2"
        >
        <button class="default-button" onclick={click}> Join as {name}!</button>
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

    .default-input {
        width: 50%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 2px solid #ffa500;
        border-radius: 8px;
        color: #ffa500;
        font-size: large;
        text-align: center;
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
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

    .shake {
        animation: shake 0.13s;
        animation-iteration-count: 3;
        border-color: red;
    }

    @keyframes shake {
        0% { margin-left: 0rem; }
        25% { margin-left: 1.15rem; }
        75% { margin-left: -1.15rem; }
        100% { margin-left: 0rem; }
    }
</style>
