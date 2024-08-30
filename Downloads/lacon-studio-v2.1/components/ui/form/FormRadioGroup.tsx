import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"
import { type Path, type Control, type FieldValues } from "react-hook-form"

type Option = { label: string; value: string; desc?: string }
type IProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    label?: string
    className?: string
    defaultValue?: string
    options: Option[]
    labelClassName?: string
    radioGroupClassName?: string
    radioItemClassName?: string
    helpText?: string
    onChange?: (value: string) => void
}

const FormRadioGroup = <T extends FieldValues>({
    name,
    label,
    control,
    options,
    defaultValue,
    helpText,
    className,
    radioGroupClassName,
    radioItemClassName,
    onChange,
}: IProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("space-y-3", className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => {
                                field.onChange(value)
                                if (onChange) onChange(value)
                            }}
                            value={field.value}
                            defaultValue={defaultValue}
                            ref={field.ref}
                            className={cn("flex flex-col space-y-1", radioGroupClassName)}
                        >
                            {options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem
                                            value={option.value}
                                            className={cn(
                                                option.value === field.value && "outline-primary",
                                                radioItemClassName
                                            )}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormRadioGroup
