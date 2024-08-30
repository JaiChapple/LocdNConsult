"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form"

import { FC, useEffect, useRef } from "react"
import Wysiwyg from "../wysiwyg"
import clsx from "clsx"
import { type Path, type Control, type FieldValues, useController } from "react-hook-form"
import Signature, { SignatureRef } from "@uiw/react-signature"
import { X } from "lucide-react"

type IProps<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    helpText?: string
    label?: string
    className?: string
}

const FormSignature = <T extends FieldValues>({ name, label, control, className, helpText }: IProps<T>) => {
    const ref = useRef<SignatureRef>(null)
    const {
        field: { value, onChange },
    } = useController({ name, control })

    const handleClearSignature = () => {
        if (!ref.current) return

        onChange([])
        ref.current.clear()
    }

    useEffect(() => {
        if (!ref.current) return

        if (value?.length) return

        ref.current.clear()
    }, [value])

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={clsx(className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <div className="w-full relative rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                            <Signature
                                options={{
                                    size: 6,
                                    smoothing: 0.46,
                                    thinning: 0.73,
                                    streamline: 0.5,
                                    easing: (t) => t,
                                    simulatePressure: true,
                                    last: true,
                                    start: {
                                        cap: true,
                                        taper: 0,
                                        easing: (t) => t,
                                    },
                                    end: {
                                        cap: true,
                                        taper: 0,
                                        easing: (t) => t,
                                    },
                                }}
                                ref={ref}
                                onPointer={(points) => (points.length ? field.onChange(points) : undefined)}
                            />
                            <div
                                className="absolute top-2 right-2 size-6 cursor-pointer rounded-full border border-input grid place-items-center"
                                onClick={handleClearSignature}
                            >
                                <X className="size-4 text-muted-foreground" />
                            </div>
                        </div>
                    </FormControl>
                    {helpText && <FormDescription>{helpText}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormSignature
