import { reactive } from 'vue';

type ValidationRule = (value: any) => boolean | string;

interface FieldConfig {
    value: any;
    rules: ValidationRule[];
}

interface FormConfig {
    [key: string]: FieldConfig;
}

interface ValidationResult {
    isValid: boolean;
    errors: { [key: string]: string[] };
}

export function useFormValidation(formConfig: FormConfig) {
    const formState = reactive<Record<string, any>>({});
    const validationResults = reactive<ValidationResult>({
        isValid: true,
        errors: {},
    });

    for (const key in formConfig) {
        formState[key] = formConfig[key].value;
        validationResults.errors[key] = [];
    }

    const validateField = (key: string) => {
        const fieldConfig = formConfig[key];
        const errors: string[] = [];

        for (const rule of fieldConfig.rules) {
            const result = rule(formState[key]);
            if (result !== true) {
                errors.push(result as string);
            }
        }

        validationResults.errors[key] = errors;
        return errors.length === 0;
    };

    const validateForm = () => {
        validationResults.isValid = true;
        for (const key in formConfig) {
            const isValid = validateField(key);
            if (!isValid) {
                validationResults.isValid = false;
            }
        }
        return validationResults.isValid;
    };

    return {
        formState,
        validationResults,
        validateField,
        validateForm,
    };
}