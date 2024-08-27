"use client"

import { type FC } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"
import { Input } from "../input"
import { cn } from "@/lib/utils"

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
    helpText?: string
    name: string
    label?: string
    control: any
    disabled?: boolean
    className?: string
    inputClassName?: string
    labelClassName?: string
    inputIcon?: React.ReactNode
}

const FormInput: FC<IProps> = ({
    name,
    label,
    placeholder,
    control,
    className,
    disabled,
    helpText,
    inputClassName,
    inputIcon,
    ...props
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn(className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <div className="w-full relative">
                            <Input
                                placeholder={placeholder}
                                disabled={disabled}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                                className={cn("h-12", Boolean(inputIcon) && "pr-10", inputClassName)}
                                {...props}
                            />
                            {inputIcon ? (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 [&>*:first-child]:size-5 [&>*:first-child]:text-muted-foreground">
                                    {inputIcon}
                                </div>
                            ) : null}
                        </div>
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormInput
