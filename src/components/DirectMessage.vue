<script setup>
    import { ref } from 'vue';
    const props = defineProps(['playMessage']);

    const message = ref('');
    const messageField = ref(null);

    const handleSend = () => {
        props.playMessage(message.value);
        messageField.value.value = '';
        message.value = '';
    }
</script>

<template>
    <div class="container">
        <div class="title">Direct Message:</div>
        <textarea id="messageField" ref="messageField" v-model="message" placeholder="A meaningful message to your favorite people :D" @keydown.enter.exact.prevent="handleSend" />
        <button class="primary-button" @click="handleSend" :disabled="message === ''">Send Message</button>
    </div>
</template>

<style scoped>
</style>