import {
    FormControl,
    FormLabel,
    Input,
    Textarea,
    FormErrorMessage,
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement> & {
        label: string
        name: string
        textarea?: boolean
    }

const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea = false,
    size: _,
    ...props
}) => {
    let InputOrTextarea = textarea ? Textarea : Input
    const [field, { error, touched }] = useField(props)

    return (
        <FormControl isInvalid={!!error && touched}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea {...field} {...props} id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    )
}

export default InputField
