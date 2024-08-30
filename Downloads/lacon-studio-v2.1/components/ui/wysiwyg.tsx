import "react-quill/dist/quill.snow.css"

import React, { FC, useEffect, useMemo, useState } from "react"

import { Quill } from "react-quill"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

interface IProps {
    value?: string
    className?: string
    onChange?: (value: string) => void
}

const Wysiwyg: FC<IProps> = ({ value, className, onChange }) => {
    const ReactQuill = useMemo(
        () =>
            dynamic(
                async () => {
                    const { default: RQ } = await import("react-quill")
                    // @ts-ignore
                    const { default: ImageResize } = await import("quill-image-resize-module")

                    RQ.Quill.register("modules/imageResize", ImageResize)

                    return RQ
                },
                { ssr: false }
            ),
        []
    )

    return (
        <div className={cn("", className)}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: [
                        [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
                        [{ size: [] }],
                        [{ align: [] }],
                        [{ color: [] }],
                        ["image"],
                        ["clean"],
                    ],
                    imageResize: {},
                }}
            />
        </div>
    )
}

export default Wysiwyg
