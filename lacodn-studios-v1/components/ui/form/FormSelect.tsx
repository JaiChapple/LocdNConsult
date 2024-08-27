import { type FC, type ReactElement } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { cn } from "@/lib/utils"

export type SelectOption = { label: string; value: string; desc?: string; icon?: ReactElement }

interface IProps {
    name: string
    label: string
    placeholder?: string
    control: any
    className?: string
    helpText?: string
    options: SelectOption[]
    disabled?: boolean
}

const FormSelect: FC<IProps> = ({ name, label, helpText, placeholder, control, options, disabled, className }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                        <FormControl>
                            <SelectTrigger className={cn("h-12", className)}>
                                <SelectValue className="shrink-0" placeholder={placeholder ?? "Select One"} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent position="item-aligned" className="z-[1200]">
                            {options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <div className="flex gap-1 items-center">
                                        {option.icon} {option.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {helpText && <FormDescription>{helpText}</FormDescription>}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormSelect
