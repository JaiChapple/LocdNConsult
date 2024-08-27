"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { Checkbox } from "../checkbox"
import { FC } from "react"
import { cn } from "@/lib/utils"

interface IProps {
    errors?: any
    rules?: any
    helpText?: string
    name: string
    label?: string
    control: any
    className?: string
    labelClassName?: string
    onChange?: (value: any) => void
}

const FormCheckbox: FC<IProps> = ({ name, label, errors, control, className, helpText, rules, onChange }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", className)}
                >
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(value) => {
                                field.onChange(value)
                                if (onChange) onChange(value)
                            }}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        {label && <FormLabel>{label}</FormLabel>}

                        {helpText && <FormDescription>{helpText}</FormDescription>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormCheckbox
