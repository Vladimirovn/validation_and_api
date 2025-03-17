<template>
    <form @submit.prevent="handleSubmit">
            <div v-for="(field, key) in formConfig" :key="key">
                <label>{{ key }}</label>
                <input v-model="formState[key]" />
                <div v-if="validationResults.errors[key].length">
                    <span v-for="error in validationResults.errors[key]" :key="error">{{ error }}</span>
                </div>
            </div>
            <button type="submit" @click="fetchData">Подтвердить</button>
            <div v-if="loading">Отправка...</div>
            <div v-if="error">{{ error }}</div>
            <div v-if="success && data">
                <pre>{{ data }}</pre>
            </div>
    </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useFormValidation } from './FormValidation';
import { useApi } from './UseApi';

export default defineComponent({
    setup() {

// Валидация форм ________________________________________________________________________________________________________________

        const formConfig = {
            username: {
                value: '',
                rules: [
                    (value) => !!value || 'Введите имя пользователя. ',
                    (value) => (value.length >= 3) || 'Имя пользователя должно содержать больше 3 символов.',
                ],
            },
            email: {
                value: '',
                rules: [
                    (value) => !!value || 'Введите почту. ',
                    (value) => /\S+@\S+\.\S+/.test(value) || 'Почта должна быть правильного формата, пример: user@gmail.com.',
                ],
            },
        };

        const { formState, validationResults, validateForm } = useFormValidation(formConfig);

        const handleSubmit = () => {
            if (validateForm()) {
                console.log('Form submitted:', formState);
            }
        };

// Использование API _________________________________________________________________________________________________________________

        const { data, loading, error, success, fetchData } = useApi({
            url: 'https://api.example.com/data',
            method: 'GET',
        });

        return {
            formState,
            validationResults,
            handleSubmit,
            formConfig,
            data,
            loading,
            error,
            success,
            fetchData,
        };
    },
});
</script>