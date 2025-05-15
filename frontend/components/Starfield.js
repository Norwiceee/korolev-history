import React, { useRef, useEffect } from "react";

export default function Starfield({ width = 400, height = 800, starCount = 120 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Создаём массив звёзд
        let stars = Array.from({ length: starCount }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * width,
            o: 0.7 + 0.3 * Math.random()
        }));

        function draw() {
            ctx.clearRect(0, 0, width, height);
            for (let s of stars) {
                // имитация движения (parallax)
                s.z -= 0.8;
                if (s.z <= 0) {
                    s.x = Math.random() * width;
                    s.y = Math.random() * height;
                    s.z = width;
                    s.o = 0.7 + 0.3 * Math.random();
                }
                let sx = (s.x - width / 2) * (width / s.z) + width / 2;
                let sy = (s.y - height / 2) * (width / s.z) + height / 2;
                let r = width / s.z * 1.2;

                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255,255,255,${s.o})`;
                ctx.fill();
            }
            animationFrameId = requestAnimationFrame(draw);
        }

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [width, height, starCount]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                background: "transparent", // canvas без фона
            }}
        />
    );

}
