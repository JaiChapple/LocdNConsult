"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import React, { useEffect, useMemo } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import {
    additionalServices,
    calculationSteps,
    densities,
    lengths,
    lockingPatterns,
    preExistingConditions,
    sizes,
    stylists,
    techniques,
} from "@/data"

import { Button } from "../ui/button"
import { Form } from "../ui/form"
import FormCalendar from "../ui/form/FormCalendar"
import FormCheckbox from "../ui/form/FormCheckbox"
import FormDateRangePicker from "../ui/form/FormDateRangePicker"
import FormInput from "../ui/form/FormInput"
import FormRadioGroup from "../ui/form/FormRadioGroup"
import FormSelect from "../ui/form/FormSelect"
import FormSignature from "../ui/form/FormSignature"
import FormWysiwig from "../ui/form/FormWysiyg"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

enum ClientType {
    newClient = "new-client",
    transferClient = "transfer-client",
}

const formSchema = z
    .object({
        generalInformation: z.object({
            clientType: z.enum([ClientType.newClient, ClientType.transferClient]),
            stylistName: z.string().min(1, "Stylist name is required*"),
        }),
        clientInformation: z.object({
            fullName: z.string().min(1, "Full name is required*"),
            phoneNumber: z.string().min(1, "Phone number is required*"),
            email: z.string().email("Invalid email*"),
            date: z
                .object({
                    to: z.date(),
                    from: z.date(),
                })
                .optional(),
            dateOfLastRetie: z.date().optional(),
            dateOfInstall: z.date().optional(),

            size: z.string().min(1, "Size is required*"),
            lockingPattern: z.string().min(1, "Locking pattern is required*"),
            density: z.string().min(1, "Density is required*"),
            length: z.string().min(1, "Length is required*"),
            technique: z.string().min(1, "Technique is required*"),
        }),

        additionalServices: z.object({
            services: z.array(
                z.object({
                    id: z.number(),
                    title: z.string(),
                    isIncluded: z.boolean(),
                    price: z.number().optional(),
                })
            ),
            trimDate: z.date().optional(),
        }),

        preExistingConditions: z.array(
            z.object({
                id: z.number(),
                title: z.string(),
                isIncluded: z.boolean(),
                description: z.string().optional(),
            })
        ),

        clientNotes: z.string().optional(),

        deposit: z.coerce.number().optional(),

        clientSignature: z.array(z.array(z.number())).min(1, "Client signature is required*"),
        stylistSignature: z.array(z.array(z.number())).min(1, "Stylist signature is required*"),
        signatureDate: z.date(),
    })
    .superRefine((arg, ctx) => {
        if (
            arg.additionalServices.services.some((el) => el.title.toLowerCase() === "trim" && el.isIncluded) &&
            !arg.additionalServices.trimDate
        )
            ctx.addIssue({ path: ["additionalServices.trimDate"], code: "custom", message: "Trim date is required" })
        if (arg.generalInformation.clientType === ClientType.newClient) {
            if (!arg.clientInformation.date)
                ctx.addIssue({ path: ["clientInformation.date"], code: "custom", message: "Date is required" })
        } else {
            if (!arg.clientInformation.dateOfLastRetie)
                ctx.addIssue({
                    path: ["clientInformation.dateOfLastRetie"],
                    code: "custom",
                    message: "Date of last retie is required",
                })
            if (!arg.clientInformation.dateOfInstall)
                ctx.addIssue({
                    path: ["clientInformation.dateOfInstall"],
                    code: "custom",
                    message: "Date of install is required",
                })
        }
    })

type FieldValues = z.infer<typeof formSchema>

const HomePageForm = () => {
    const form = useForm<FieldValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            generalInformation: {
                clientType: ClientType.newClient,
                stylistName: "",
            },
            clientInformation: {
                fullName: "",
                phoneNumber: "",
                email: "",
                size: "",
                density: "",
                length: "",
                technique: "",
                lockingPattern: "",
            },

            additionalServices: {
                services: additionalServices.map((service) => ({
                    id: service.id,
                    isIncluded: false,
                    title: service.title,
                    price: service.price,
                })),
            },

            preExistingConditions: preExistingConditions.map((condition) => ({
                id: condition.id,
                isIncluded: false,
                title: condition.title,
                description: condition.description,
            })),

            clientSignature: [],
            stylistSignature: [],
        },
    })

    const size = form.watch("clientInformation.size")
    const density = form.watch("clientInformation.density")
    const length = form.watch("clientInformation.length")
    const technique = form.watch("clientInformation.technique")
    const deposit = form.watch("deposit") ?? 0
    const services = form.watch("additionalServices.services").filter((service) => service.isIncluded)
    const isTrimServiceIncluded = services.some((el) => el.title.toLowerCase() === "trim" && el.isIncluded)

    const isNewClient = form.watch("generalInformation.clientType") === ClientType.newClient

    const { total, subtotal, servicesTotal, duration, remainingBalance } = useMemo(() => {
        const service = calculationSteps.find(
            (step) => step.size === size && step.density === density && step.length === length
        )
        const servicesTotal = services.reduce((prev, curr) => prev + (curr.price ?? 0), 0)
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

    useEffect(() => {
        if (isNewClient) {
            form.clearErrors(["clientInformation.dateOfInstall", "clientInformation.dateOfLastRetie"])
            form.setValue(
                "clientInformation.technique",
                typeof technique === "undefined" ? "" : technique === "Other" ? techniques[0] : technique
            )
            form.setValue("clientInformation.dateOfInstall", undefined)
            form.setValue("clientInformation.dateOfLastRetie", undefined)
        } else {
            form.clearErrors(["clientInformation.date"])
            form.setValue("clientInformation.date", undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNewClient])

    return (
        <Form {...form}>
            <div className="sm:space-y-10 space-y-5 final-slip">
                <Card>
                    <CardHeader>
                        <CardTitle>General information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                            <FormSelect
                                label="Stylist Name"
                                control={form.control}
                                name="generalInformation.stylistName"
                                options={stylists.map((el) => ({ label: el, value: el }))}
                            />
                            <FormRadioGroup
                                control={form.control}
                                name="generalInformation.clientType"
                                options={[
                                    { label: "New Client", value: ClientType.newClient },
                                    { label: "Transfer Client", value: ClientType.transferClient },
                                ]}
                                label="Client Type"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Client information</CardTitle>
                        <CardDescription>
                            Please enter the following information about your client and their hair.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                name="clientInformation.density"
                                options={densities.map((density) => ({ label: density, value: density }))}
                                placeholder="Density"
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
                                name="clientInformation.length"
                                options={lengths.map((length) => ({
                                    label: length.replace(/inch(es)?\.?/, "in."),
                                    value: length,
                                }))}
                                placeholder="Length"
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
                                name="clientInformation.size"
                                options={sizes.map((size) => ({ label: size, value: size }))}
                                placeholder="Size"
                            />

                            {isNewClient ? (
                                <FormDateRangePicker control={form.control} label="" name="clientInformation.date" />
                            ) : (
                                <>
                                    <FormCalendar
                                        control={form.control}
                                        name="clientInformation.dateOfLastRetie"
                                        placeholder="Date of Last Retie"
                                    />
                                    <FormCalendar
                                        control={form.control}
                                        name="clientInformation.dateOfInstall"
                                        placeholder="Date of Install"
                                    />
                                </>
                            )}
                            <FormSelect
                                control={form.control}
                                label=""
                                name="clientInformation.technique"
                                options={[...techniques, ...(!isNewClient ? ["Other (See Client Notes)"] : [])].map(
                                    (technique) => ({
                                        label: technique,
                                        value: technique,
                                    })
                                )}
                                placeholder="Technique"
                            />

                            <FormSelect
                                control={form.control}
                                label=""
                                name="clientInformation.lockingPattern"
                                options={lockingPatterns.map((pattern) => ({
                                    label: pattern,
                                    value: pattern,
                                }))}
                                placeholder="Locking Pattern"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pre-existing Conditions</CardTitle>
                        <CardDescription>
                            Please select any pre-existing conditions the client may have from the list below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="sm:space-y-4 space-y-2">
                            <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-2">
                                {preExistingConditions.map((service, i) => (
                                    <FormCheckbox
                                        key={service.title}
                                        control={form.control}
                                        name={`preExistingConditions.${i}.isIncluded`}
                                        label={`${service.title}`}
                                        helpText={service.description}
                                    />
                                ))}
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
                                        name={`additionalServices.services.${i}.isIncluded`}
                                        label={`${service.title} ${
                                            service.price || service.minutes
                                                ? `($${service.price.toFixed(2)}, ${service.minutes} minutes)`
                                                : ""
                                        }`}
                                        helpText={service.description}
                                    />
                                ))}
                                {isTrimServiceIncluded && (
                                    <FormCalendar
                                        control={form.control}
                                        name="additionalServices.trimDate"
                                        label="Trim Date"
                                    />
                                )}
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
                                            <p className="text-sm font-semibold">${(service.price ?? 0).toFixed(2)} USD</p>
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
                                <p className="text-sm">Estimated Time</p>
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
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <FormSignature control={form.control} helpText="Client Signature" name="clientSignature" />
                            <FormSignature
                                control={form.control}
                                helpText="Stylist Signature"
                                name="stylistSignature"
                            />
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
