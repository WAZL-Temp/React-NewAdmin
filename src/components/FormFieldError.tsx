

interface FormFieldErrorProps {
    field: string;
    errors: Record<string, string>;
}

export default function FormFieldError({ field, errors }: FormFieldErrorProps) {
    if (!errors[field]) return null;

    return (
        <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
            {errors[field]}
        </p>
    );
}
