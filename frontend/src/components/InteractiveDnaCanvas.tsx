"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface Point3D {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
  px: number;
  py: number;
  opacity: number;
  targetOpacity: number;
  label: string;
  isCitation: boolean;
  pulseScale: number;
}

interface InteractiveDnaCanvasProps {
  activeState: "idle" | "thinking" | "grounded";
}

export const InteractiveDnaCanvas: React.FC<InteractiveDnaCanvasProps> = ({ activeState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: "",
    x: 0,
    y: 0,
    visible: false,
  });

  const mouse = useRef({ x: -1000, y: -1000, rx: 0, ry: 0 });
  const points = useRef<Point3D[]>([]);
  const rotationAngle = useRef(0);
  const currentRotationSpeed = useRef(0.003);
  const canvasScale = useRef(1.0);

  // Sample data simulating vectors / document chunks
  const databaseChunks = [
    { label: "kdigo_bp_guidelines.pdf · p.42", isCitation: true },
    { label: "jnc8_hypertension_protocol.pdf · p.12", isCitation: true },
    { label: "who_cardiovascular_safety.pdf · p.89", isCitation: true },
    { label: "metformin_renal_contraindications.pdf · p.104", isCitation: true },
    { label: "nih_stroke_prevention_study.pdf · p.15", isCitation: true },
    { label: "clinical_monitoring_standards.pdf · p.2", isCitation: true },
    { label: "icd11_clinical_diagnostics.pdf · p.304", isCitation: true },
    { label: "kdigo_bp_guidelines.pdf · p.43", isCitation: false },
    { label: "jnc8_hypertension_protocol.pdf · p.13", isCitation: false },
    { label: "who_cardiovascular_safety.pdf · p.90", isCitation: false },
    { label: "metformin_renal_contraindications.pdf · p.105", isCitation: false },
    { label: "nih_stroke_prevention_study.pdf · p.16", isCitation: false },
    { label: "clinical_monitoring_standards.pdf · p.3", isCitation: false },
    { label: "icd11_clinical_diagnostics.pdf · p.305", isCitation: false },
    { label: "kdigo_bp_guidelines.pdf · p.44", isCitation: false },
    { label: "jnc8_hypertension_protocol.pdf · p.14", isCitation: false },
    { label: "who_cardiovascular_safety.pdf · p.91", isCitation: false },
    { label: "metformin_renal_contraindications.pdf · p.106", isCitation: false },
    { label: "nih_stroke_prevention_study.pdf · p.17", isCitation: false },
    { label: "clinical_monitoring_standards.pdf · p.4", isCitation: false },
    { label: "icd11_clinical_diagnostics.pdf · p.306", isCitation: false },
    { label: "kdigo_bp_guidelines.pdf · p.45", isCitation: false },
    { label: "jnc8_hypertension_protocol.pdf · p.15", isCitation: false },
    { label: "who_cardiovascular_safety.pdf · p.92", isCitation: false },
    { label: "metformin_renal_contraindications.pdf · p.107", isCitation: false },
    { label: "nih_stroke_prevention_study.pdf · p.18", isCitation: false },
    { label: "clinical_monitoring_standards.pdf · p.5", isCitation: false },
    { label: "icd11_clinical_diagnostics.pdf · p.307", isCitation: false },
  ];

  // Initialize nodes
  useEffect(() => {
    const pts: Point3D[] = [];
    const rungsCount = databaseChunks.length / 2;

    for (let i = 0; i < databaseChunks.length; i++) {
      const isA = i % 2 === 0;
      const rungIndex = Math.floor(i / 2);
      const angle = rungIndex * (Math.PI * 2 / rungsCount);
      const y = (rungIndex - rungsCount / 2) * 20;

      // Node A is placed positively along the spiral width, Node B negatively
      const radius = 55;
      const x = isA ? Math.cos(angle) * radius : -Math.cos(angle) * radius;
      const z = isA ? Math.sin(angle) * radius : -Math.sin(angle) * radius;

      pts.push({
        x,
        y,
        z,
        tx: x,
        ty: y,
        tz: z,
        px: 0,
        py: 0,
        opacity: 0.8,
        targetOpacity: 0.8,
        label: databaseChunks[i].label,
        isCitation: databaseChunks[i].isCitation,
        pulseScale: 1.0,
      });
    }

    points.current = pts;
  }, []);

  // Update target coordinates based on state morphs
  useEffect(() => {
    const pts = points.current;
    if (!pts.length) return;

    if (activeState === "idle") {
      // 1. Idle Double Helix Shape
      currentRotationSpeed.current = 0.003;
      const rungsCount = pts.length / 2;
      pts.forEach((p, i) => {
        const isA = i % 2 === 0;
        const rungIndex = Math.floor(i / 2);
        const angle = rungIndex * (Math.PI * 2 / rungsCount);
        const y = (rungIndex - rungsCount / 2) * 20;
        const radius = 55;
        p.tx = isA ? Math.cos(angle) * radius : -Math.cos(angle) * radius;
        p.ty = y;
        p.tz = isA ? Math.sin(angle) * radius : -Math.sin(angle) * radius;
        p.targetOpacity = 0.85;
        p.pulseScale = 1.0;
      });
    } else if (activeState === "thinking") {
      // 2. Thinking State: Scatter in a random spherical cloud
      currentRotationSpeed.current = 0.012;
      pts.forEach((p) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 80 + Math.random() * 30;

        p.tx = Math.sin(phi) * Math.cos(theta) * radius;
        p.ty = Math.sin(phi) * Math.sin(theta) * radius;
        p.tz = Math.cos(phi) * radius;
        p.targetOpacity = 0.6;
        p.pulseScale = 1.0;
      });
    } else if (activeState === "grounded") {
      // 3. Grounded State: Highlighted matched citations pull into focal foreground circle
      currentRotationSpeed.current = 0.001; // nearly still
      pts.forEach((p, i) => {
        if (p.isCitation && i < 8) {
          // matched nodes pull forward into a compact focused ring
          const angle = (i / 8) * Math.PI * 2;
          p.tx = Math.cos(angle) * 35;
          p.ty = Math.sin(angle) * 35;
          p.tz = 90; // Pull forward along Z
          p.targetOpacity = 1.0;
          p.pulseScale = 1.4;
        } else {
          // unmatched background nodes fade/dim down and recede
          p.targetOpacity = 0.15;
          p.tz = -90;
          p.pulseScale = 0.7;
        }
      });
    }
  }, [activeState]);

  // Handle Canvas Drawing & Physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 450;
      canvas.width = w;
      canvas.height = h;
      canvasScale.current = Math.min(w, h) / 450;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const checkHover = () => {
      let hoveredPoint: Point3D | null = null;
      let minDistance = 14;

      points.current.forEach((p) => {
        const dx = p.px - mouse.current.rx;
        const dy = p.py - mouse.current.ry;
        const dist = Math.hypot(dx, dy);
        if (dist < minDistance) {
          hoveredPoint = p;
          minDistance = dist;
        }
      });

      if (hoveredPoint && activeState !== "thinking") {
        setTooltip({
          text: (hoveredPoint as Point3D).label,
          x: (hoveredPoint as Point3D).px + 10,
          y: (hoveredPoint as Point3D).py - 25,
          visible: true,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const pts = points.current;

      // Update rotation angle
      rotationAngle.current += currentRotationSpeed.current;

      // 3D projection parameters
      const fov = 350;
      const cosA = Math.cos(rotationAngle.current);
      const sinA = Math.sin(rotationAngle.current);

      pts.forEach((p) => {
        // Interpolate toward morph target
        p.x = gsap.utils.interpolate(p.x, p.tx, 0.08);
        p.y = gsap.utils.interpolate(p.y, p.ty, 0.08);
        p.z = gsap.utils.interpolate(p.z, p.tz, 0.08);
        p.opacity = gsap.utils.interpolate(p.opacity, p.targetOpacity, 0.1);

        // Apply Y-axis rotation
        const rx1 = p.x * cosA - p.z * sinA;
        const rz1 = p.z * cosA + p.x * sinA;

        // Apply projection coordinates
        const scale = fov / (fov + rz1);
        p.px = cx + (rx1 * scale) * canvasScale.current;
        p.py = cy + (p.y * scale) * canvasScale.current;

        // Apply cursor repulsion
        const dx = p.px - mouse.current.x;
        const dy = p.py - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        const repulsionRadius = 100 * canvasScale.current;
        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          p.px += (dx / dist) * force * 15 * canvasScale.current;
          p.py += (dy / dist) * force * 15 * canvasScale.current;
        }
      });

      // Draw connection lines for double helix structure (only in idle mode)
      if (activeState === "idle") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = Math.max(0.5, canvasScale.current);
        for (let i = 0; i < pts.length; i += 2) {
          if (pts[i + 1]) {
            ctx.beginPath();
            ctx.moveTo(pts[i].px, pts[i].py);
            ctx.lineTo(pts[i + 1].px, pts[i + 1].py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes sorted by Z-index to render depth correctly
      const sortedPoints = [...pts].sort((a, b) => b.z - a.z);

      sortedPoints.forEach((p) => {
        const size = (p.isCitation ? 4.5 * p.pulseScale : 3 * p.pulseScale) * Math.max(canvasScale.current, 0.45);
        const color = p.isCitation ? "#3DD9B4" : "#7C5CFF";

        ctx.save();
        ctx.shadowBlur = (p.isCitation ? 12 : 8) * Math.max(canvasScale.current, 0.4);
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        ctx.arc(p.px, p.py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      checkHover();
      requestRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeState]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
    mouse.current.rx = mouse.current.x;
    mouse.current.ry = mouse.current.y;
  };

  const handleMouseLeave = () => {
    mouse.current.x = -1000;
    mouse.current.y = -1000;
    mouse.current.rx = -1000;
    mouse.current.ry = -1000;
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      ref={containerRef}
      className="dna-canvas-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-default relative z-10" />

      {/* Interactive Node Citation Tooltip */}
      {tooltip.visible && (
        <div
          className="dna-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            opacity: tooltip.visible ? 1 : 0,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
