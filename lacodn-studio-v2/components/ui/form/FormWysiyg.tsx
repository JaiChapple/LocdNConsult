"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { FC } from "react"
import Wysiwyg from "../wysiwyg"
import clsx from "clsx"
import { type Path, type Control, type FieldValues } from "react-hook-form"

type IProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    helpText?: string
    label?: string
    className?: string
    wysiwigClassName?: string
}

const FormWysiwig = <T extends FieldValues>({
    name,
    label,
    control,
    className,
    helpText,
    wysiwigClassName,
}: IProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={clsx(className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Wysiwyg
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            className={wysiwigClassName}
                        />
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormWysiwig
