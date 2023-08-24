<script setup>
    import SimpleKeyboard from './components/Keyboard.vue';
    import KeybindMenu from './components/KeybindMenu.vue';
    import DirectMessage from './components/DirectMessage.vue';
    import SettingsMenu from './components/SettingsMenu.vue';
    import { onBeforeMount, onMounted, readonly, ref } from 'vue';

    const key = ref('');
    const message = ref('');
    const devices = ref([]);
    let shouldMonitor;
    let microphoneInput;
    let microphoneInputAudioContext;
    let ttsAudioOutElement;
    let ttsAudioMonitorElement;

    let onKeyPress = async (button) => {
        button = cleanAndStripKey(button);
        key.value = button;
        message.value = await window['api'].getMessage(button);
    }

    let updateMessage = (msg) => {
        message.value = msg;
        window['api'].setKeybind(key.value, msg);
    }

    let removeBinding = () => {
        window['api'].removeKeybind(key.value);
    }

    let cleanAndStripKey = (key) => {
        return key.replace('{', '').replace('}', '');
    }

    let setAudioOutput = async (id) => {
        if (ttsAudioOutElement) ttsAudioOutElement.remove();
        
        if (microphoneInputAudioContext) microphoneInputAudioContext.close();
        
        ttsAudioOutElement = new Audio();
        ttsAudioOutElement.id = 'audio';
        document.getElementById('app').appendChild(ttsAudioOutElement);
        await ttsAudioOutElement.setSinkId(id);

        navigator.getUserMedia(
            {audio: true}, 
            (stream) => {
                microphoneInputAudioContext = new AudioContext({sinkId: id || "default"});
                microphoneInput = microphoneInputAudioContext.createMediaStreamSource(stream);
                microphoneInput.connect(microphoneInputAudioContext.destination);
            },
            () => {
                console.log('Error: 003');
            }
        );
    }

    let setAudioMonitor = async (id) => {
        if (ttsAudioMonitorElement) ttsAudioMonitorElement.remove();
        
        ttsAudioMonitorElement = new Audio();
        ttsAudioMonitorElement.id = 'audio-monitor'
        await ttsAudioMonitorElement.setSinkId(id);
        document.getElementById('app').appendChild(ttsAudioMonitorElement);
    }


    let playMessage = async (message) => {
        const audioContent = new Blob([await window['api'].getAudio(message)], {type: 'audio.ogg'});
        const audioURL = URL.createObjectURL(audioContent);
        if (ttsAudioOutElement) {
            ttsAudioOutElement.src = audioURL;
            ttsAudioOutElement.load();
            ttsAudioOutElement.play();
        }

        if (shouldMonitor && ttsAudioMonitorElement) {
            ttsAudioMonitorElement.src = audioURL;
            ttsAudioMonitorElement.load();
            ttsAudioMonitorElement.play();
        }
    }

    let saveSettings = (settings) => {
        setAudioOutput(settings['output-device']);
        setAudioMonitor(settings['monitor-device']);
        shouldMonitor = settings['monitor'];
        window['api'].saveSettings(settings);
    }

    onMounted(async () => {
        devices.value = await navigator.mediaDevices.enumerateDevices();
        const settings = await window['api'].getSettings();
        shouldMonitor = settings['monitor'];
        await setAudioOutput(settings['output-device'] || 'default');
        await setAudioMonitor(settings['monitor-device'] || 'default');
    });

</script>

<template>
    <SimpleKeyboard @onKeyPress='onKeyPress'/>
    <div class='bottom-menu'>
        <KeybindMenu 
            :currentKey='key' 
            :currentMessage='message' 
            :updateMessage='updateMessage' 
            :removeBinding='removeBinding' 
        />

        <DirectMessage :play-message='playMessage' />
        
        <SettingsMenu 
            :save-settings='saveSettings' 
            :devices='devices'
        />
    </div>
</template>

<style>
    #app {
        display: flex;
        gap: 1rem;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        background-color: #121212;
        padding: 1rem;
        color: #f6f5f4;
        font-family: 'Fira Sans', sans-serif;
    }

    #app *::selection {
        background-color: #fdfd96;
        color: #121212;
    }

    #app *:focus {
        outline-color: #fdfd96;
    }

    .bottom-menu {
        height: 100%;
        width: 100%;
        gap: 1rem;
        display: flex;
    }

    .container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        padding: 1rem;
        margin: 0;
        user-select: none;
        height: 100%;
        width: 100%;
    }

    .title {
        font-size: x-large;
        user-select: none;
        width: 100%;
    }

    textarea {
        background-color: #121212;
        border: none;
        border-radius: 5px;
        font-size: large;
        color: #f6f5f4;
        resize: none;
        flex-grow: 1;
        width: 100%;
        padding: 0.25rem 0.5rem;
    }

    .primary-button, .secondary-button {
        font-size: larger;
        border-radius: 5px;
        background: #121212;
        color: #f6f5f4;
        border: none;
        padding: 0.5rem 0.25rem;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        width: 100%;
    }

    .primary-button:hover:not(:disabled) {
        background-color: rgba(253, 253, 150, 0.5);
    }

    .primary-button:active:not(:disabled) {
        background-color: #fdfd96;
        color: #121212;
    }

    .secondary-button:hover:not(:disabled) {
        background-color: rgba(253, 150, 150, 0.5);
    }

    .secondary-button:active:not(:disabled) {
        background-color: #fd9696;
        color: #121212;
    }

    .primary-button:disabled, .secondary-button:disabled {
        color: #f6f5f466;
        cursor: default;
    }



</style>
