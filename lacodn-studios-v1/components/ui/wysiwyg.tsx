import "react-quill/dist/quill.snow.css";
import React, { FC, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

interface IProps {
    value?: string
    className?: string
    onChange?: (value: string) => void
}

const Wysiwyg: FC<IProps> = ({ value, className, onChange }) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])

    return (
        <div className={cn("", className)}>
            <ReactQuill theme="snow" value={value} onChange={onChange} />
        </div>
    )
}

export default Wysiwyg
