"use client"

import { FC, useEffect, useState } from "react"
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useWatch } from "react-hook-form"

type IProps = {
    name: string
    control: any
    helpText?: string
    label?: string
    disabled?: boolean
    className?: string
    labelClassName?: string
    buttonClassName?: string
    disableButton?: boolean
}

const FormDateRangePicker: FC<IProps> = ({
    name,
    control,
    helpText,
    label,
    disabled,
    className,
    labelClassName,
    buttonClassName,
    disableButton,
}) => {
    const formDate = useWatch({
        control,
        name,
    })

    const [date, setDate] = useState(formDate)

    useEffect(() => {
        setDate(formDate)
    }, [formDate])

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    {label && <FormLabel className={cn("", labelClassName)}>{label}</FormLabel>}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 justify-start h-12 font-normal",
                                    !field.value && "text-muted-foreground",
                                    buttonClassName
                                )}
                                ref={field.ref}
                                disabled={disableButton}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                    field.value?.to ? (
                                        <>
                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                            {format(field.value.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(field.value.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                disabled={disabled}
                                selected={date}
                                onSelect={(value) => {
                                    if (value?.from && value?.to) field.onChange(value)
                                    setDate(value)
                                }}
                                numberOfMonths={2}
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

export default FormDateRangePicker
