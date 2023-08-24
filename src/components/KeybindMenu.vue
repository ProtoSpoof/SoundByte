<script setup>
    import { ref, onMounted } from 'vue';
    const props = defineProps(['currentKey', 'currentMessage', 'updateMessage', 'removeBinding']);
    const keyMap = {
        'ESCAPE':'esc',
        'F1':'f1',
        'F2':'f2',
        'F3':'f3',
        'F4':'f4',
        'F5':'f5',
        'F6':'f6',
        'F7':'f7',
        'F8':'f8',
        'F9':'f9',
        'F10':'f10',
        'F11':'f11',
        'F12':'f12',
        'OEM_3':'`',
        'OEM_MINUS': '-',
        'OEM_PLUS': '=',
        'BACK': 'backspace',
        'TAB': 'tab',
        'OEM_4': '[',
        'OEM_6': ']',
        'OEM_5': '\\',
        'CAPSLOCK': 'caps',
        'OEM_1': ';',
        'OEM_7': '\'',
        'RETURN': 'enter',
        'LSHIFT': 'L shift',
        'OEM_COMMA': ',',
        'OEM_PERIOD': '.',
        'OEM_2': '/',
        'RSHIFT': 'R shift',
        'LCONTROL': 'L ctrl',
        'LALT': 'L alt',
        'SPACE': 'spacebar',
        'RALT': 'R alt',
        'APPS': 'menu',
        'RCONTROL': 'R ctrl',
        'SNAPSHOT': 'print',
        'SCROLL': 'scrlk',
        'PAUSE': 'pause',
        'INSERT': 'ins',
        'HOME': 'home',
        'PRIOR': 'pgup',
        'DELETE': 'del',
        'END': 'end',
        'NEXT': 'pgdn',
        'UP': '↑',
        'LEFT': '←',
        'DOWN': '↓',
        'RIGHT': '→',
        'NUMLOCK': 'lock',
        'DIVIDE': '/',
        'MULTIPLY': '*',
        'NUMPAD7': '7',
        'NUMPAD8': '8',
        'NUMPAD9': '9',
        'NUMPAD4': '4',
        'NUMPAD5': '5',
        'NUMPAD6': '6',
        'NUMPAD1': '1',
        'NUMPAD2': '2',
        'NUMPAD3': '3',
        'NUMPAD0': '0',
        'DECIMAL': '.',
        'SUBTRACT':'-',
        'ADD':'+',
    };

    const message = ref(props.currentMessage);
    const messageField = ref(null);
    const handleUpdate = () => {
        props.updateMessage(message.value);
        messageField.value.value = '';
        message.value = '';
    }

    const handleRemove = () => {
        handleUpdate('')
        props.removeBinding();
    }

</script>

<template>
    <div v-if='currentKey === ""' class='container no-key'>
        <div class='title'>Select a key to begin editing</div>
    </div>
    <div v-else class='container'>
        <div class='title spacer'>Now Editing: <span>{{ keyMap[currentKey] || currentKey }}</span></div>
        <textarea id='messageField' ref='messageField' v-model='message' :placeholder='currentMessage || "Your super special message..."' />
        <div class='button-container'>
            <button id='saveButton' class='primary-button' v-if='currentMessage !== message && message !== ""' @click='handleUpdate'>Save Changes</button>
            <button class='primary-button' v-else disabled>Save Changes</button>
            <button id='removeButton' class='secondary-button' @click='handleRemove'>Remove Binding</button>
        </div>
    </div>
</template>

<style scoped>
    .title span {
        text-transform: uppercase;
    }

    .spacer {
        display: flex;
        justify-content: space-between;
    }

    .no-key {
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .button-container {
        display: flex;
        gap: 1rem;
    }

</style>