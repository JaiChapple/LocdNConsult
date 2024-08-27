"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Path, type Control, type FieldValues } from "react-hook-form"

type IProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    helpText?: string
    label?: string
    disabled?: boolean
    className?: string
    labelClassName?: string
    placeholder?: string
}

const FormCalendar = <T extends FieldValues>({
    name,
    control,
    helpText,
    label,
    disabled,
    className,
    labelClassName,
    placeholder,
}: IProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel className={cn("", labelClassName)}>{label}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-12 pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    ref={field.ref}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>{placeholder ?? "Pick a date"}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={disabled}
                                initialFocus
                                className={cn("", className)}
                            />
                        </PopoverContent>
                    </Popover>
                    {helpText ? <FormDescription>{helpText}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormCalendar
