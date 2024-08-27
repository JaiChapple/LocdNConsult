"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { FC } from "react"
import { Textarea } from "../textarea"
import clsx from "clsx"

interface IProps {
    name: string
    label: string
    control: any
    className?: string
    helpText?: string
    placeholder?: string
    inputClassName?: string
}

const FormTextArea: FC<IProps> = ({ name, label, helpText, placeholder, control, className, inputClassName }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={clsx(className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className={clsx("resize-none h-full", inputClassName)}
                            {...field}
                        />
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormTextArea
