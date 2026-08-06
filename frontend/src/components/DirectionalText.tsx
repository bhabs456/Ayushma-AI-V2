"use client"

import { CSSProperties, MouseEvent, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type VerticalSide = "idle" | "above" | "below"

interface DirectionalTextProps {
    children: string
    restingColor?: string
    activeColor?: string
    duration?: number
    className?: string
    style?: CSSProperties
}

const positionVariants = {
    above: { transform: "translate3d(0, 0%, 0)" },
    idle: { transform: "translate3d(0, -33.333%, 0)" },
    below: { transform: "translate3d(0, -66.666%, 0)" },
}

export function DirectionalText({
    children,
    restingColor = "#f5f5f5",
    activeColor = "#7c5cff",
    duration = 520,
    className,
    style,
}: DirectionalTextProps) {
    const textRef = useRef<HTMLSpanElement>(null)
    const [activeSide, setActiveSide] = useState<VerticalSide>("idle")
    
    const activeSideRef = useRef<VerticalSide>("idle")
    const animating = useRef(false)
    const pendingRequest = useRef<VerticalSide | null>(null)
    const hovered = useRef(false)
    
    const reduceMotion = useReducedMotion()

    const updateActiveSide = (next: VerticalSide) => {
        activeSideRef.current = next
        setActiveSide(next)
    }

    const requestActiveSide = (next: VerticalSide) => {
        if (reduceMotion) {
            updateActiveSide(next)
            return
        }

        if (next === activeSideRef.current) {
            pendingRequest.current = null
            return
        }

        if (animating.current) {
            pendingRequest.current = next
            return
        }

        animating.current = true
        updateActiveSide(next)
    }

    const detectVerticalSide = (event: MouseEvent<HTMLSpanElement>) => {
        hovered.current = true
        const element = textRef.current
        if (!element) return

        const bounds = element.getBoundingClientRect()
        const pointerPosition = event.clientY - bounds.top
        const enteredFromTop = pointerPosition < bounds.height / 2
        const side = enteredFromTop ? "above" : "below"

        requestActiveSide(side)
    }

    const handleMouseLeave = () => {
        hovered.current = false
        requestActiveSide("idle")
    }

    const completeAnimation = () => {
        if (!animating.current) return
        animating.current = false

        if (
            pendingRequest.current !== null &&
            pendingRequest.current !== activeSideRef.current
        ) {
            const next = pendingRequest.current
            pendingRequest.current = null
            animating.current = true
            updateActiveSide(next)
        } else {
            pendingRequest.current = null
        }
    }

    return (
        <span
            ref={textRef}
            className={className}
            onMouseEnter={detectVerticalSide}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                display: "inline-block",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                userSelect: "none",
                verticalAlign: "top",
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    visibility: "hidden",
                    display: "block",
                    whiteSpace: "nowrap",
                }}
            >
                {children}
            </span>

            <motion.span
                variants={positionVariants}
                initial="idle"
                animate={activeSide}
                onAnimationComplete={completeAnimation}
                transition={{
                    duration: duration / 1000,
                    ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                    position: "absolute",
                    inset: 0,
                    height: "300%",
                    display: "grid",
                    gridTemplateRows: "repeat(3, 1fr)",
                    willChange: "transform",
                }}
            >
                <TextLayer color={activeColor}>{children}</TextLayer>
                <TextLayer color={restingColor}>{children}</TextLayer>
                <TextLayer color={activeColor}>{children}</TextLayer>
            </motion.span>
        </span>
    )
}

interface TextLayerProps {
    children: string
    color: string
}

function TextLayer({ children, color }: TextLayerProps) {
    const isGradient = color.includes("gradient") || color.startsWith("linear-gradient");
    
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                ...(isGradient ? {
                    background: color,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                } : {
                    color,
                })
            }}
        >
            {children}
        </span>
    )
}
