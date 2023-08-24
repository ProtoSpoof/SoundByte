<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';

    const props = defineProps(['saveSettings', 'devices']);

    const settings = ref({
        'output-device': 'default',
        'monitor-device': 'default',
        'monitor': true,
    });

    const handleClick = () => {
        props.saveSettings({...settings.value});
    }

    onMounted(async () => {
        let returnedSettings = await window['api'].getSettings();
        if (!returnedSettings) {
            props.saveSettings({...settings.value});
            return;
        }
        settings.value = returnedSettings;
    });

</script>

<template>
    <div class='container'>

        <div class='title'>Settings:</div>
        <div class='settings-container'>
            <div class='setting'>
                <label for="output-device">Output Device</label>
                <select name="output-device" id="output-device" v-model="settings['output-device']">
                    <option 
                        v-for="device in devices.filter((dvc) => dvc.kind === 'audiooutput')" 
                        :value='device.deviceId'
                    >
                        {{ device.label }}
                    </option>
                </select>
            </div>
    
            <div class='setting'>
                <label for="monitor-device">Monitor Device</label>
                <select name="monitor-device" id="monitor-device" v-model="settings['monitor-device']">
                    <option 
                        v-for="device in devices.filter((dvc) => dvc.kind === 'audiooutput')" 
                        :value='device.deviceId'
                    >
                        {{ device.label }}
                    </option>
                </select>
            </div>
    
            <div class='setting'>
                <label for="monitor">Monitor</label>
                <input type="checkbox" name="monitor" id="monitor" v-model="settings['monitor']">
            </div>
        </div>

        <button class="primary-button" @click="handleClick">Save</button>

    </div>
</template>

<style scoped>
    .container {
        width: 70%;
    }

    .settings-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .setting {
        display: flex;
        justify-content: space-between;
    }

    .setting select {
        width: 45%;
        background-color: #121212;
        color: #f6f5f4;
    }
</style>