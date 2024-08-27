"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import React, { useMemo } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { additionalServices, calculationSteps, densities, lengths, sizes, techniques } from "@/data"

import { Button } from "../ui/button"
import { Form } from "../ui/form"
import FormCalendar from "../ui/form/FormCalendar"
import FormCheckbox from "../ui/form/FormCheckbox"
import FormDateRangePicker from "../ui/form/FormDateRangePicker"
import FormInput from "../ui/form/FormInput"
import FormSelect from "../ui/form/FormSelect"
import FormWysiwig from "../ui/form/FormWysiyg"
import { Separator } from "../ui/separator"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    clientInformation: z.object({
        fullName: z.string().min(1, "Full name is required*"),
        phoneNumber: z.string().min(1, "Phone number is required*"),
        email: z.string().email("Invalid email*"),
        date: z.object({
            to: z.date(),
            from: z.date(),
        }),

        size: z.string().min(1, "Size is required*"),
        density: z.string().min(1, "Density is required*"),
        length: z.string().min(1, "Length is required*"),
        technique: z.string().min(1, "Technique is required*"),
    }),

    services: z.array(
        z.object({
            id: z.number(),
            title: z.string(),
            isIncluded: z.boolean(),
            price: z.number(),
        })
    ),

    clientNotes: z.string().optional(),

    deposit: z.coerce.number().optional(),

    clientName: z.string().min(1, "Client name is required*"),
    stylistName: z.string().min(1, "Stylist name is required*"),
    signatureDate: z.date(),
})

type FieldValues = z.infer<typeof formSchema>

const HomePageForm = () => {
    const form = useForm<FieldValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientInformation: {
                fullName: "",
                phoneNumber: "",
                email: "",
                size: "",
                density: "",
                length: "",
                technique: "",
            },

            services: additionalServices.map((service) => ({
                id: service.id,
                isIncluded: false,
                title: service.title,
                price: service.price,
            })),

            clientName: "",
            stylistName: "",
        },
    })

    const size = form.watch("clientInformation.size")
    const density = form.watch("clientInformation.density")
    const length = form.watch("clientInformation.length")
    const deposit = form.watch("deposit") ?? 0
    const services = form.watch("services").filter((service) => service.isIncluded)

    const { total, subtotal, servicesTotal, duration, remainingBalance } = useMemo(() => {
        const service = calculationSteps.find(
            (step) => step.size === size && step.density === density && step.length === length
        )
        const servicesTotal = services.reduce((prev, curr) => prev + curr.price, 0)
        const subtotal = service?.price ?? 0
        const total = subtotal + servicesTotal
        const remainingBalance = total - deposit

        return { subtotal, total, servicesTotal, duration: service?.duration ?? 0, remainingBalance }
    }, [size, density, length, services, deposit])

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        let element = document.querySelector(".final-slip")?.outerHTML

        element = element?.replaceAll(/<span style="pointer-events: none;">(.*?)<\/span>/g, "<p>$1</p>")
        const newDivElement = document.createElement("div")

        newDivElement.innerHTML = element ?? ""

        // @ts-ignore
        const { default: html2pdf } = await import("html2pdf.js")

        html2pdf()
            .set({
                margin: 10,
                filename: values.clientInformation.fullName + ".pdf",
            })
            .from(newDivElement)
            .save()

        form.reset()
    }

    return (
        <Form {...form}>
            <div className="sm:space-y-10 space-y-5 final-slip">
                <Card>
                    <CardHeader>
                        <CardTitle>Client information</CardTitle>
                        <CardDescription>
                            Please enter the following information about your client and their hair.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:space-y-4 space-y-2">
                            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                                <FormInput
                                    control={form.control}
                                    label=""
                                    name="clientInformation.fullName"
                                    placeholder="Full name"
                                />
                                <FormSelect
                                    control={form.control}
                                    label=""
                                    name="clientInformation.size"
                                    options={sizes.map((size) => ({ label: size, value: size }))}
                                    placeholder="Size"
                                />
                                <FormInput
                                    control={form.control}
                                    label=""
                                    type="number"
                                    name="clientInformation.phoneNumber"
                                    placeholder="Phone number"
                                />
                                <FormSelect
                                    control={form.control}
                                    label=""
                                    name="clientInformation.density"
                                    options={densities.map((density) => ({ label: density, value: density }))}
                                    placeholder="Density"
                                />
                                <FormInput
                                    control={form.control}
                                    label=""
                                    name="clientInformation.email"
                                    placeholder="Email"
                                />
                                <FormSelect
                                    control={form.control}
                                    label=""
                                    name="clientInformation.length"
                                    options={lengths.map((length) => ({ label: length, value: length }))}
                                    placeholder="Length"
                                />
                                <FormDateRangePicker control={form.control} label="" name="clientInformation.date" />
                                <FormSelect
                                    control={form.control}
                                    label=""
                                    name="clientInformation.technique"
                                    options={techniques.map((technique) => ({
                                        label: technique,
                                        value: technique,
                                    }))}
                                    placeholder="Technique"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Additional Services</CardTitle>
                        <CardDescription>
                            If the client requires any additional services, please select from the options below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:space-y-4 space-y-2">
                            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                                {additionalServices.map((service, i) => (
                                    <FormCheckbox
                                        key={service.id}
                                        control={form.control}
                                        name={`services[${i}].isIncluded`}
                                        label={`${service.title} ($${service.price.toFixed(2)}, ${
                                            service.minutes
                                        } minutes)`}
                                        helpText={service.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Client Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormWysiwig control={form.control} label="" name="clientNotes" wysiwigClassName="" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Readout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Subtotal</p>
                                <p className="text-sm font-semibold">${subtotal.toFixed(2)} USD</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Additional Recommendations total</p>
                                    <p className="text-sm font-semibold">${servicesTotal.toFixed(2)} USD</p>
                                </div>

                                <div className="space-y-1 pl-3">
                                    {services.map((service) => (
                                        <div key={service.id} className="flex items-center justify-between">
                                            <p className="text-sm">{service.title}</p>
                                            <p className="text-sm font-semibold">${service.price.toFixed(2)} USD</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <p className="text-sm">Total Price</p>
                                <p className="text-sm font-semibold">${total.toFixed(2)} USD</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm">Deposit</p>
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    $ -
                                    <FormInput control={form.control} name="deposit" type="number" />
                                    <p className="text-sm font-semibold"> USD</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm">Remaining Balance</p>
                                <p className="text-sm font-semibold">${remainingBalance.toFixed(2)} USD</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm">Total Time</p>
                                <p className="text-sm font-semibold">{duration} Days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Signature</CardTitle>
                        <CardDescription>By signing below you agree to our policy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                            <FormInput control={form.control} helpText="Client Name" name="clientName" />
                            <FormInput control={form.control} helpText="Stylist Name" name="stylistName" />
                            <FormCalendar control={form.control} helpText="Date" name="signatureDate" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end items-center gap-4">
                <Button variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
            </div>
        </Form>
    )
}

export default HomePageForm
