"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { Checkbox } from "../checkbox"
import { FC } from "react"
import { cn } from "@/lib/utils"
import { type Path, type Control, type FieldValues } from "react-hook-form"

type IProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    errors?: any
    rules?: any
    helpText?: string
    label?: string
    className?: string
    labelClassName?: string
    onChange?: (value: any) => void
}

const FormCheckbox = <T extends FieldValues>({
    name,
    label,
    errors,
    control,
    className,
    helpText,
    rules,
    onChange,
}: IProps<T>) => {
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
