"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { FC } from "react"
import Wysiwyg from "../wysiwyg"
import clsx from "clsx"

interface IProps {
    helpText?: string
    name: string
    label: string
    control: any
    className?: string
    wysiwigClassName?: string
}

const FormWysiwig: FC<IProps> = ({ name, label, control, className, helpText, wysiwigClassName }) => {
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
